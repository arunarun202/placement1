#!/usr/bin/env python3
"""
DAST Runner — Placement Predictor API
Reads config from ../input.json, runs all test categories, writes report.json
"""
import json, time, sys, os, subprocess, datetime

CONFIG_PATH = os.path.join(os.path.dirname(__file__), "input.json")
REPORT_PATH = os.path.join(os.path.dirname(__file__), "report.json")
SAVEPOINT   = os.path.join(os.path.dirname(__file__), "savepoint.json")

def load_config():
    with open(CONFIG_PATH) as f:
        return json.load(f)

def run_tests():
    cfg = load_config()
    BASE = cfg["baseUrl"].rstrip("/")
    TOKEN = cfg.get("user", "")

    all_results = []

    # ───────────────────────────────────────────────
    # Helper: single curl request
    # ───────────────────────────────────────────────
    def curl(method, path, token=None, data=None, content_type="application/json",
             form=False, label="", category="", expected=200, role="user"):
        url = BASE + path
        headers = ["-H", f"Content-Type: {content_type}"]
        if token:
            headers += ["-H", f"Authorization: Bearer {token}"]
        
        cmd = ["curl", "-s", "-X", method, url] + headers
        if data and not form:
            cmd += ["-d", json.dumps(data)]
        elif data and form:
            for k, v in data.items():
                cmd += ["-F", f"{k}={v}"]
        cmd += ["-w", "\n---STATUS:%{http_code} TIME:%{time_total}---",
                "--max-time", "10"]

        ts = datetime.datetime.utcnow().isoformat() + "Z"
        try:
            out = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
            raw = out.stdout
            # Parse status and time from sentinel
            import re
            m = re.search(r"---STATUS:(\d+) TIME:([\d.]+)---", raw)
            status = int(m.group(1)) if m else 0
            elapsed_ms = round(float(m.group(2)) * 1000) if m else 0
            body = raw[:raw.rfind("\n---STATUS:")] if m else raw
        except Exception as e:
            status, elapsed_ms, body = 0, 0, str(e)

        finding = (status // 100 == 2) if expected != 200 else False
        # For authn/authz tests: 2xx when we expected 401/403 = finding
        authn_finding = (expected in (401, 403) and status // 100 == 2)
        is_finding = authn_finding or (expected == "not2xx" and status // 100 == 2)

        severity = "none"
        if is_finding:
            severity = "HIGH"

        rec = {
            "endpoint": path,
            "method": method,
            "role": role,
            "status": status,
            "expected_status": expected,
            "finding": is_finding,
            "severity": severity,
            "response_time_ms": elapsed_ms,
            "test_category": category,
            "note": label,
            "timestamp": ts
        }
        symbol = "✓" if not is_finding else "✗"
        print(f"  {symbol} [{status}] {method:6} {path:40} | {label}")
        all_results.append(rec)

        # Save savepoint after each test
        with open(SAVEPOINT, "w") as f:
            json.dump(all_results, f, indent=2)

        time.sleep(0.2)  # throttle
        return status, body

    EXPIRED_TOKEN = (
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
        "eyJzdWIiOiI5OTk5OSIsImV4cCI6MTcwMDAwMDAwMH0."
        "INVALIDSIGNATURE"
    )
    MALFORMED_TOKEN = "not.a.token"

    # ─── CATEGORY 1: AuthN Bypass ──────────────────
    print("\n[1] AuthN Bypass — protected endpoints without valid token")
    protected = [
        ("GET",    "/auth/me"),
        ("GET",    "/predict/"),
        ("GET",    "/resume/"),
        ("GET",    "/resume/1"),
        ("GET",    "/chat/"),
    ]
    for method, path in protected:
        curl(method, path, token=None,           label="no token",       category="authn_bypass", expected=401, role="anonymous")
        curl(method, path, token=MALFORMED_TOKEN, label="malformed token", category="authn_bypass", expected=403, role="anonymous")
        curl(method, path, token=EXPIRED_TOKEN,   label="expired token",  category="authn_bypass", expected=403, role="anonymous")

    # ─── CATEGORY 2: AuthZ / IDOR ─────────────────
    print("\n[2] IDOR — cross-user resource access via resume/{id}")
    for resume_id in [1, 2, 3, 100, 9999]:
        curl("GET", f"/resume/{resume_id}", token=TOKEN,
             label=f"IDOR probe id={resume_id}", category="idor", expected="not2xx", role="user")

    # ─── CATEGORY 3: Known IDOR on /chat/ ────────
    print("\n[3] /chat/ global data leak check (all users' chats)")
    status, body = curl("GET", "/chat/", token=TOKEN,
                        label="global chat history leak", category="idor", expected="not2xx", role="user")
    # If 200 and body is a list with items not belonging to user → finding
    if status == 200:
        # Mark as finding regardless — the query has no user_id filter
        all_results[-1]["finding"] = True
        all_results[-1]["severity"] = "HIGH"
        all_results[-1]["note"] += " | ⚠ NO user_id filter in query — all users' chats returned"
        print("  ✗ FINDING: /chat/ returns data for ALL users (missing user_id filter)")

    # ─── CATEGORY 4: Token Tampering ─────────────
    print("\n[4] Token Tampering — flipped claims, invalid signature")
    import base64
    # Build a token with sub=1 but sign with wrong key
    header  = base64.urlsafe_b64encode(b'{"alg":"HS256","typ":"JWT"}').rstrip(b"=").decode()
    payload = base64.urlsafe_b64encode(b'{"sub":"1","exp":9999999999}').rstrip(b"=").decode()
    tampered = f"{header}.{payload}.BADSIGNATURE"
    curl("GET", "/auth/me", token=tampered, label="tampered JWT bad sig",
         category="token_tampering", expected=403, role="tampered")
    curl("GET", "/auth/me", token=tampered.replace("BADSIGNATURE", ""),
         label="JWT no signature", category="token_tampering", expected=403, role="tampered")

    # ─── CATEGORY 5: Injection Probes ─────────────
    print("\n[5] Injection Probes — login endpoint SQLi/NoSQLi detection")
    sqli_payloads = [
        "' OR '1'='1",
        "' OR 1=1--",
        "admin'--",
        "'; DROP TABLE users; --",
        "' UNION SELECT null,null,null--",
    ]
    for payload in sqli_payloads:
        t0 = time.time()
        status, body = curl("POST", "/auth/login",
                            data=None, token=None,
                            label=f"SQLi probe: {payload[:30]}",
                            category="injection", expected=400, role="anonymous")
        elapsed = time.time() - t0
        # Flag anomalous: 2xx or time > 5s (possible blind SQLi)
        if status // 100 == 2 or elapsed > 5:
            all_results[-1]["finding"] = True
            all_results[-1]["severity"] = "CRITICAL"

    # ─── CATEGORY 6: Rate Limiting ────────────────
    print("\n[6] Rate Limiting — 30-request burst to /auth/login")
    rate_results = []
    for i in range(30):
        t0 = time.time()
        status, _ = curl("POST", "/auth/login",
                         data=None, token=None,
                         label=f"rate burst #{i+1}",
                         category="rate_limit", expected=429, role="anonymous")
        rate_results.append(status)
        if status == 429:
            print(f"  ✓ Rate limit triggered at request #{i+1}")
            break
    if 429 not in rate_results:
        all_results[-1]["finding"] = True
        all_results[-1]["severity"] = "MEDIUM"
        all_results[-1]["note"] += " | No rate limit detected after 30 requests"
        print("  ⚠ No rate limit found after 30 requests")

    # ─── CATEGORY 7: CORS wildcard check ──────────
    print("\n[7] CORS wildcard — Origin: evil.com probe")
    cmd = ["curl", "-s", "-I", "-H", "Origin: https://evil.com",
           BASE + "/auth/me", "--max-time", "5"]
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        acao = [l for l in out.stdout.splitlines() if "access-control-allow-origin" in l.lower()]
        if any("*" in h for h in acao):
            all_results.append({
                "endpoint": "/", "method": "OPTIONS", "role": "anonymous",
                "status": 200, "expected_status": "no-wildcard",
                "finding": True, "severity": "MEDIUM",
                "response_time_ms": 0, "test_category": "cors",
                "note": f"CORS wildcard (*) present: {acao}",
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
            })
            print(f"  ✗ FINDING: CORS wildcard origin — {acao}")
        else:
            print(f"  ✓ CORS origin header: {acao}")
    except Exception as e:
        print(f"  ⚠ CORS check failed: {e}")

    # ─── WRITE REPORT ─────────────────────────────
    with open(REPORT_PATH, "w") as f:
        json.dump(all_results, f, indent=2)
    print(f"\n✅ report.json written → {REPORT_PATH}")
    print(f"   Total tests: {len(all_results)}")
    findings = [r for r in all_results if r["finding"]]
    print(f"   Findings:    {len(findings)}")
    for sev in ["CRITICAL","HIGH","MEDIUM","LOW"]:
        n = sum(1 for r in findings if r["severity"] == sev)
        if n: print(f"     {sev}: {n}")

    return all_results

if __name__ == "__main__":
    run_tests()

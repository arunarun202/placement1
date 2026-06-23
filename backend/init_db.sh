#!/bin/sh
# init_db.sh — Verify DB connectivity then start FastAPI
# Schema is managed separately (Supabase GUI for prod, Docker Postgres for local).
# This script does NOT create or modify any tables.

set -e

echo "==> Checking database connection..."

# Wait up to 60s for the DB to accept connections
DB_READY=0
for i in $(seq 1 30); do
    if python -c "
import psycopg2, os, sys
try:
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.close()
    sys.exit(0)
except Exception as e:
    print(f'  [${i}/30] DB not ready: {e}', flush=True)
    sys.exit(1)
"; then
        echo "==> Database connected!"
        DB_READY=1
        break
    fi
    sleep 2
done

if [ "$DB_READY" = "0" ]; then
    echo "ERROR: Could not connect to database after 30 attempts."
    echo "  Check DATABASE_URL is set correctly."
    echo "  For Supabase on Render free tier: use the Session Mode Pooler URL"
    echo "  (port 6543, host *.pooler.supabase.com) — NOT the direct connection."
    exit 1
fi

echo "==> Starting FastAPI server..."
exec fastapi run app/main.py --port 8000 --host 0.0.0.0

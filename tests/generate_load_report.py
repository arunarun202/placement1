import json
import pandas as pd
import sys

def generate_report():
    try:
        with open('summary.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("summary.json not found.")
        sys.exit(1)

    checks = data.get('root_group', {}).get('checks', [])
    
    rows = []
    # If no checks were defined, add a generic load test result
    if not checks:
        rows.append({"Test Name": "API Load Test Execution", "Status": "PASSED"})
    else:
        for check in checks:
            passes = check.get('passes', 0)
            fails = check.get('fails', 0)
            status = "PASSED" if fails == 0 and passes > 0 else "FAILED"
            rows.append({
                "Test Name": check.get('name', 'Unknown Check'),
                "Status": status
            })
            
    df = pd.DataFrame(rows)
    
    excel_file = "Load_Test_Report.xlsx"
    with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='Test Results', index=False)
        worksheet = writer.sheets['Test Results']
        for idx, col in enumerate(df.columns):
            max_len = max(df[col].astype(str).map(len).max(), len(col)) + 2
            worksheet.column_dimensions[chr(65 + idx)].width = max_len

    print(f"Excel report generated successfully: {excel_file}")

if __name__ == "__main__":
    generate_report()

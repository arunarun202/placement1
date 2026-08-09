import json
import pandas as pd
import sys
import os

def generate_report():
    rows = []
    
    if os.path.exists('gitleaks-report.json'):
        try:
            with open('gitleaks-report.json', 'r') as f:
                leaks = json.load(f)
                
            if not leaks:
                rows.append({"Test Name": "Gitleaks Security Scan", "Status": "PASSED"})
            else:
                for leak in leaks:
                    rule = leak.get('RuleID', 'Unknown')
                    file = leak.get('File', 'Unknown')
                    rows.append({"Test Name": f"Gitleaks: {rule} in {file}", "Status": "FAILED"})
        except Exception as e:
            rows.append({"Test Name": "Gitleaks Security Scan", "Status": "FAILED"})
    else:
        # If the file doesn't exist but gitleaks ran successfully, it means 0 leaks
        rows.append({"Test Name": "Gitleaks Security Scan", "Status": "PASSED"})
        
    df = pd.DataFrame(rows)
    
    excel_file = "Security_Test_Report.xlsx"
    with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='Test Results', index=False)
        worksheet = writer.sheets['Test Results']
        for idx, col in enumerate(df.columns):
            max_len = max(df[col].astype(str).map(len).max(), len(col)) + 2
            worksheet.column_dimensions[chr(65 + idx)].width = max_len

    print(f"Excel report generated successfully: {excel_file}")

if __name__ == "__main__":
    generate_report()

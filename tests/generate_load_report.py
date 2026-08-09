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

    metrics = data.get('metrics', {})
    
    # Extract requests per second
    http_reqs = metrics.get('http_reqs', {})
    rps = http_reqs.get('rate', 0)
    total_reqs = http_reqs.get('count', 0)
    
    # Extract response times
    http_req_duration = metrics.get('http_req_duration', {})
    values = http_req_duration.get('values', {})
    avg_time = values.get('avg', 0)
    min_time = values.get('min', 0)
    max_time = values.get('max', 0)
    
    # Create a DataFrame
    df = pd.DataFrame([
        {
            "Metric": "Total Requests",
            "Value": f"{total_reqs} requests"
        },
        {
            "Metric": "Requests per second (RPS)",
            "Value": f"{rps:.2f} req/sec"
        },
        {
            "Metric": "Response Time - Average",
            "Value": f"{avg_time:.2f} ms"
        },
        {
            "Metric": "Response Time - Min",
            "Value": f"{min_time:.2f} ms"
        },
        {
            "Metric": "Response Time - Max",
            "Value": f"{max_time:.2f} ms"
        }
    ])
    
    # Export to Excel
    excel_file = "Load_Test_Report.xlsx"
    with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='Load Test Results', index=False)
        
        # Auto-adjust columns width
        worksheet = writer.sheets['Load Test Results']
        for idx, col in enumerate(df.columns):
            max_len = max(df[col].astype(str).map(len).max(), len(col)) + 2
            worksheet.column_dimensions[chr(65 + idx)].width = max_len

    print(f"Excel report generated successfully: {excel_file}")

if __name__ == "__main__":
    generate_report()

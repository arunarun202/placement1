#!/bin/sh
# init_db.sh — Apply schema.sql to the database (idempotent)
# Uses IF NOT EXISTS so it's safe to run on every startup.
# Called by the Dockerfile CMD instead of 'alembic upgrade head'.

set -e

echo "Waiting for database to be ready..."
# Wait up to 30s for the DB to accept connections
for i in $(seq 1 30); do
    python -c "
import psycopg2, os, sys
try:
    psycopg2.connect(os.environ['DATABASE_URL'])
    sys.exit(0)
except Exception:
    sys.exit(1)
" && break
    echo "  DB not ready yet, retrying in 1s... ($i/30)"
    sleep 1
done

echo "Applying schema.sql..."
python -c "
import psycopg2, os

conn = psycopg2.connect(os.environ['DATABASE_URL'])
conn.autocommit = True
cur = conn.cursor()

# Read and execute schema.sql — wrapped in IF NOT EXISTS so it's idempotent
with open('/app/schema.sql', 'r') as f:
    sql = f.read()

# Execute the full schema (all CREATE TABLE/INDEX statements)
cur.execute(sql)
conn.close()
print('Schema applied successfully.')
"

echo "Starting FastAPI server..."
exec fastapi run app/main.py --port 8000 --host 0.0.0.0

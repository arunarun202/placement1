#!/bin/sh
# init_db.sh — Apply schema.sql to the database (idempotent)
# Uses IF NOT EXISTS so it's safe to run on every startup.
# Called by the Dockerfile CMD instead of 'alembic upgrade head'.

set -e

echo "==> Waiting for database to be ready..."

# Wait up to 60s for the DB to accept connections
DB_READY=0
for i in $(seq 1 60); do
    if python -c "
import psycopg2, os, sys
try:
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.close()
    sys.exit(0)
except Exception as e:
    print(f'  [{i}/60] DB not ready: {e}', flush=True)
    sys.exit(1)
"; then
        echo "==> Database is ready!"
        DB_READY=1
        break
    fi
    sleep 2
done

if [ "$DB_READY" = "0" ]; then
    echo "ERROR: Could not connect to database after 60 attempts. Check DATABASE_URL."
    echo "  Hint: For Supabase on Render free tier, use the SESSION MODE POOLER URL (port 6543, not 5432)."
    echo "  Get it from: Supabase dashboard -> Project Settings -> Database -> Connection Pooling -> Session mode"
    exit 1
fi

echo "==> Applying schema.sql..."
python -c "
import psycopg2, os

conn = psycopg2.connect(os.environ['DATABASE_URL'])
conn.autocommit = True
cur = conn.cursor()

with open('/app/schema.sql', 'r') as f:
    sql = f.read()

cur.execute(sql)
conn.close()
print('==> Schema applied successfully.')
"

echo "==> Starting FastAPI server..."
exec fastapi run app/main.py --port 8000 --host 0.0.0.0

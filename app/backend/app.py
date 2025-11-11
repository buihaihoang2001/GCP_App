from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import os, psycopg2, uuid, shutil

DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME", "postgres")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/data/uploads")

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def db_conn():
    return psycopg2.connect(
        host=DB_HOST, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD
    )

def ensure_table():
    try:
        conn = db_conn()
        cur = conn.cursor()
        cur.execute("""
        CREATE TABLE IF NOT EXISTS numbers (
          id UUID PRIMARY KEY,
          value INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
        """)
        conn.commit()
        cur.close(); conn.close()
    except Exception as e:
        print("Init table error:", e)

ensure_table()
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/healthz")
def health():
    return {"status": "ok"}

@app.post("/numbers")
def insert_number(value: int = Form(...)):
    try:
        _id = str(uuid.uuid4())
        conn = db_conn(); cur = conn.cursor()
        cur.execute("INSERT INTO numbers(id, value) VALUES(%s, %s)", (_id, value))
        conn.commit(); cur.close(); conn.close()
        return {"id": _id, "value": value, "status": "saved"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/upload")
def upload_image(file: UploadFile = File(...)):
    try:
        fname = f"{uuid.uuid4()}_{file.filename}"
        dest = os.path.join(UPLOAD_DIR, fname)
        with open(dest, "wb") as f:
            shutil.copyfileobj(file.file, f)
        return {"file": fname, "status": "uploaded"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/list")
def list_items():
    conn = db_conn(); cur = conn.cursor()
    cur.execute("SELECT id, value, created_at FROM numbers ORDER BY created_at DESC;")
    items = [{"id": i[0], "value": i[1], "created_at": i[2]} for i in cur.fetchall()]
    cur.close(); conn.close()
    files = os.listdir(UPLOAD_DIR)
    return {"numbers": items, "images": files}
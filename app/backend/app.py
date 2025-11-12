from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os, psycopg2, uuid, shutil
from datetime import datetime

# ==== Config ====
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME", "postgres")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/data/uploads")

# ==== Init app ====
app = FastAPI(title="Demo Backend", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://136.119.113.193", 
        "http://136.119.113.193:80",
        "http://136.119.113.193:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==== DB utils ====
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
        cur.close()
        conn.close()
        print("✅ Table 'numbers' ready")
    except Exception as e:
        print("❌ Init table error:", e)

ensure_table()
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ==== API ====

@app.get("/healthz")
def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

# 🧮 Nhận dữ liệu số từ frontend
@app.post("/numbers")
def insert_number(value: int = Form(...)):
    """Nhận value dạng form-urlencoded và lưu vào DB"""
    try:
        _id = str(uuid.uuid4())
        now = datetime.now()
        conn = db_conn()
        cur = conn.cursor()
        cur.execute("INSERT INTO numbers(id, value, created_at) VALUES(%s, %s, %s)", (_id, value, now))
        conn.commit()
        cur.close()
        conn.close()

        message = f"Số {value} đã được lưu vào bảng numbers trong CloudSQL vào ngày {now.strftime('%d/%m/%Y %H:%M:%S')}"
        print(f"✅ {message}")

        return {
            "id": _id,
            "value": value,
            "saved_at": now.isoformat(),
            "message": message
        }
    except Exception as e:
        print("❌ Insert error:", e)
        return JSONResponse(status_code=500, content={"error": str(e)})

# 🖼 Upload ảnh
@app.post("/upload")
def upload_image(file: UploadFile = File(...)):
    try:
        import re
        from urllib.parse import quote

        # Làm sạch tên file để tránh lỗi khi truy cập
        safe_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', file.filename)
        dest = os.path.join(UPLOAD_DIR, safe_name)

        with open(dest, "wb") as f:
            shutil.copyfileobj(file.file, f)

        print(f"✅ Uploaded file: {safe_name}")
        return {"file": safe_name, "url": f"/uploads/{quote(safe_name)}", "status": "uploaded"}
    except Exception as e:
        print("❌ Upload error:", e)
        return JSONResponse(status_code=500, content={"error": str(e)})

# 📦 Trả danh sách số và ảnh
@app.get("/list")
def list_items():
    try:
        from urllib.parse import quote
        conn = db_conn()
        cur = conn.cursor()
        cur.execute("SELECT id, value, created_at FROM numbers ORDER BY created_at DESC;")
        rows = cur.fetchall()
        items = []
        for i in rows:
            description = f"Số {i[1]} đã được lưu vào bảng numbers trong CloudSQL vào ngày {i[2].strftime('%d/%m/%Y %H:%M:%S')}"
            items.append({"id": i[0], "value": i[1], "created_at": i[2], "description": description})
        cur.close()
        conn.close()

        files = os.listdir(UPLOAD_DIR)
        images = [{"filename": f, "url": f"/uploads/{quote(f)}"} for f in files]
        return {"numbers": items, "images": images}
    except Exception as e:
        print("❌ List error:", e)
        return JSONResponse(status_code=500, content={"error": str(e)})

# 🖼 Cho phép truy cập ảnh trực tiếp
@app.get("/uploads/{filename}")
def get_uploaded_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "File not found"})
    return FileResponse(file_path)
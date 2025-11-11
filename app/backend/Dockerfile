# --- Build stage ---
FROM python:3.11-slim AS builder

# Cài đặt dependencies hệ thống (psycopg2 cần libpq)
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements trước để cache layer
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code backend
COPY . .

# --- Final stage ---
FROM python:3.11-slim

WORKDIR /app

# Copy từ stage builder
COPY --from=builder /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY --from=builder /usr/local/bin /usr/local/bin
COPY . .

# Tạo thư mục lưu upload (nếu chưa có)
RUN mkdir -p /data/uploads

EXPOSE 8000

# Chạy FastAPI bằng Uvicorn (hoặc Gunicorn-Uvicorn)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
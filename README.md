
# Hướng dẫn chạy backend

Tài liệu này hướng dẫn cả đội chạy đầy đủ backend của dự án trên máy local.

## Thành phần chính

- `backend` — API Node.js + Express, cổng `3001`
- `db` — MySQL 8.0, cổng host `3307`
- `chroma` — vector store cho RAG, cổng `8000`
- `chroma-init` — job tự động nạp dữ liệu mẫu vào Chroma
- `adminer` — giao diện quản trị MySQL, cổng `8080`

## Yêu cầu

- Node.js 20+ và npm
- Docker Desktop
- Một file `backend/.env` hợp lệ

## Cấu hình môi trường

1. Copy file mẫu:

```bash
cp backend/.env.example backend/.env
cp .env.example .env
```

2. Kiểm tra các giá trị quan trọng trong `backend/.env`:

```bash
API_KEY=your_google_gemini_api_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
CHROMA_URL=http://localhost:8000
CHROMA_COLLECTION=sentimind_call_memory
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=<your_db_password>
DB_NAME=customer_care_db
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

> Ghi chú: embeddings đã chuyển sang Xenova nên không cần OpenAI cho phần vector hóa.
> Với Docker Compose, hãy đặt cùng giá trị `DB_PASSWORD` trong shell hoặc file `.env` ở thư mục gốc để MySQL và backend dùng chung mật khẩu.

## Cách chạy khuyến nghị

### 1) Cài dependencies

```bash
npm install
cd backend
npm install
cd ..
```

### 2) Khởi động hạ tầng

```bash
docker compose up -d
```

Lệnh này sẽ tự chạy:
- MySQL và import schema lần đầu
- Chroma
- `chroma-init` để nạp sẵn dữ liệu tiếng Việt vào collection
- Adminer

### 3) Chạy backend

```bash
npm run start:backend
```

Backend sẽ chạy tại:

- API: http://localhost:3001
- Health check: http://localhost:3001/api/health

## Cách kiểm tra nhanh

```bash
docker compose ps
docker compose logs -f chroma-init
```

Nếu `chroma-init` đã chạy xong, Chroma sẽ có sẵn dữ liệu mẫu để truy xuất.

## Chạy frontend khi cần

### Chạy frontend (phát triển)

Cài dependencies và khởi động frontend dev server:

```bash
npm install
# hoặc dùng setup script
npm run setup

# khởi động dev server
npm run start:frontend
```

Server dev mặc định:

- http://localhost:5173

### Build và preview

Để build production và preview cục bộ:

```bash
npm run build
npm run preview
```

### Chạy frontend khi code thay đổi (dev)

Nếu muốn chỉ chạy frontend (không khởi backend), dùng:

```bash
npm run dev
```

### Ghi chú về môi trường

Frontend dùng cổng `5173` theo mặc định. Nếu cần thay đổi URL frontend được cấu hình trong backend, chỉnh `FRONTEND_URL` trong `backend/.env`.

Nếu bạn mới clone repo, làm theo các bước sau để chuẩn bị cả frontend và backend:

```bash
git clone <repo-url>
cd CSC-main
cp backend/.env.example backend/.env
cp .env.example .env
npm install
cd backend && npm install && cd ..
```

Sau đó, bạn có thể chạy toàn bộ hạ tầng bằng Docker hoặc khởi backend và frontend riêng lẻ như ở các phần trên.

## Nạp lại dữ liệu Chroma thủ công

Nếu cần seed lại collection:

```bash
cd backend
npm run seed:chroma
```

Lệnh này là idempotent: chạy lại sẽ cập nhật đúng các ID đã seed, không tạo bản sao.

## Tắt toàn bộ dịch vụ

```bash
docker compose down
```

Nếu muốn xoá luôn dữ liệu để tạo lại từ đầu:

```bash
docker compose down -v
```


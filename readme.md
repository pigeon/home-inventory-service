# 🏠 Home Inventory API

A lightweight FastAPI-based backend for managing boxes and items in a home inventory. Ideal for tracking household items with support for photo uploads, search functionality, and structured data via OpenAPI.

## 🚀 Features

* Create and manage **boxes** and **items**
* Upload item photos via `multipart/form-data`
* Retrieve all items within a box
* Full-text **search** support for item names
* OpenAPI documentation (via `/docs`)

---

## 📦 Requirements

* Python 3.9+
* Docker (for containerised deployment)

---

## 🛠️ Setup & Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/home-inventory.git
cd home-inventory
```

### 2. Create and activate a virtual environment (optional)

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the API server

```bash
uvicorn main:app --reload
```

Access the app at: [http://localhost:8000](http://localhost:8000)
API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🐳 Docker Setup

### 1. Build and run with Docker Compose

```bash
docker-compose up --build
```

The app will be available at [http://localhost:8000](http://localhost:8000)

---

## 📂 Project Structure

```
.
├── main.py             # FastAPI entrypoint
├── models.py           # SQLModel database models
├── schemas.py          # Pydantic schemas for request/response
├── crud.py             # Business logic and DB interaction
├── database.py         # Session setup
├── Dockerfile          # Container build instructions
├── docker-compose.yml  # Local deployment config
├── requirements.txt    # Python dependencies
└── openapi.yaml        # OpenAPI 3 spec
```

---

## 🔍 API Reference

The OpenAPI spec is available in:

* Swagger UI: `/docs`
* Raw YAML: [`openapi.yaml`](./openapi.yaml)

---

## 📸 Notes on File Uploads

* Item creation (`POST /boxes/{box_id}/items`) accepts file uploads using `multipart/form-data`.
* `photo` should be included in the request body as a file.

---

## 🧪 Example API Calls (via `curl`)

**Create Box**

```bash
curl -X POST http://localhost:8000/boxes \
  -H "Content-Type: application/json" \
  -d '{"number": "BX-001", "description": "Office"}'
```

**Add Item with Photo**

```bash
curl -X POST http://localhost:8000/boxes/1/items \
  -F "name=Screwdriver" \
  -F "note=Philips" \
  -F "photo=@./path/to/image.jpg"
```

---

## 📤 Deployment

You can deploy this project using:

* Docker on any cloud provider or VPS
* Services like Render, Railway, Fly.io (using Dockerfile)
* Uvicorn behind a reverse proxy (e.g. nginx)

Make sure to set `--host 0.0.0.0` and use a production-ready server like `gunicorn` for production environments.

---



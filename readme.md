# 🏠 Home Inventory API

A lightweight FastAPI-based backend for managing boxes and items in a home inventory. Ideal for tracking household items with support for photo uploads, search functionality, and structured data via OpenAPI.

## 🚀 Features

* Create and manage **boxes** and **items**
* Upload item photos via `multipart/form-data`
* Retrieve all items within a box
* Simple search by item name or note
* OpenAPI documentation (via `/docs`)
* Quick service health check via `/health`
* Simple web UI available at `/web`

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
Web UI: [http://localhost:8000/web](http://localhost:8000/web)

---

## 🐳 Docker Setup

### 1. Build and run with Docker Compose

```bash
docker-compose up --build
```

This will start the FastAPI backend only.
The app will be available at [http://localhost:8000](http://localhost:8000)
Web UI: [http://localhost:8000/web](http://localhost:8000/web)

---

## 📂 Project Structure

```
.
├── app/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   └── database.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── openapi.yaml
```

---

## 🔍 API Reference

The OpenAPI spec is available in:

* Swagger UI: `/docs`
* Raw YAML: [`openapi.yaml`](./openapi.yaml)
* Simple Web UI: `/web`

---

## 📸 Notes on File Uploads

* Item creation (`POST /boxes/{box_id}/items`) accepts file uploads using `multipart/form-data`.
* `photo` should be included in the request body as a file.

---

## 🧪 Example API Calls (via `curl`)

**Create Box**

```bash
curl -X POST http://localhost:8000/boxes \
  -F "number=BX-001" \
  -F "description=Office"
```
_Optionally include_ `-F "photo=@./path/to/box.jpg"` _to upload an image._

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



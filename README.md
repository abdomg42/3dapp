# 3D App CMS

## Overview
A full-stack CMS for 3D assets, featuring:
- **Frontend**: React (Vite, Tailwind CSS)
- **Backend**: Node.js (Express, PostgreSQL)
- **Image Search**: Python (TensorFlow, FAISS)

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL
- **Python**: TensorFlow, FAISS, OpenCV, scikit-learn, Pillow

---

## Project Structure
```
front-end/   # React + Vite frontend
back-end/    # Node.js + Express backend, Python scripts
```

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd <project-root>
```

### 2. Database Setup (PostgreSQL)
- Create a PostgreSQL database.
- Set environment variables for the backend:
  - `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

### 3. Backend Setup
```bash
cd back-end
npm install
# Create a .env file with your DB credentials
# Example:
# PGHOST=localhost
# PGDATABASE=your_db
# PGUSER=your_user
# PGPASSWORD=your_password
npm run dev  # or node server.js for production
```

### 4. Python Service Setup
```bash
cd back-end
pip install -r requirements.txt
# To run the image search service (if needed):
python mobilenet_faiss.py
```

### 5. Frontend Setup
```bash
cd front-end
npm install
npm run dev  # for development
npm run build  # for production build
```

---

## API Endpoints (Backend)

### Product
- `GET /Product/getProducts` — List all products
- `GET /Product/getProductsWithSort` — List products with sorting
- `GET /Product/getProduct/:id` — Get product by ID
- `GET /Product/search` — Search products
- `GET /Product/category/:categoryName` — Products by category
- `GET /Product/format/:formatName` — Products by format
- `GET /Product/logiciel/:logicielName` — Products by logiciel
- `POST /Product/createProduct` — Create product (with file/image upload)
- `POST /Product/search-by-image` — Search by image
- `PUT /Product/updateProduct/:id` — Update product
- `DELETE /Product/deleteProduct/:id` — Delete product

### User
- `GET /user/getUsers` — List users (admin)
- `GET /user/getUser/:id` — Get user (admin)
- `POST /user/createUser` — Register
- `POST /user/login` — Login
- `POST /user/logout` — Logout
- `POST /user/RefreshToken` — Refresh token
- `GET /user/profile` — Get profile
- `PUT /user/updateUser/:id` — Update user (admin)
- `DELETE /user/deleteUser/:id` — Delete user (admin)

### Category, Format, Logiciel
- CRUD endpoints for `/Category`, `/Format`, `/Logiciel`

### Favorites
- `POST /favorite/add` — Add to favorites
- `DELETE /favorite/remove` — Remove from favorites
- `GET /favorite/user` — Get user favorites
- `GET /favorite/check/:productId` — Check if product is favorite

---

## Python Service (mobilenet_faiss.py)
- Used for image feature extraction and similarity search.
- Called from backend via child process.
- Requires: TensorFlow, FAISS, OpenCV, Pillow, scikit-learn, numpy

---

## Environment Variables
### Backend (`back-end/.env`)
```
PGHOST=localhost
PGDATABASE=your_db
PGUSER=your_user
PGPASSWORD=your_password
```

### Frontend (`front-end/.env`)
- Set API base URL if needed (e.g., `VITE_API_URL`)

---

## Deployment on Render

### 1. Push your code to GitHub.
### 2. Backend (Web Service)
- Root: `back-end`
- Build Command: `npm install`
- Start Command: `npm run dev` or `node server.js`
- Add environment variables in Render dashboard

### 3. Frontend (Static Site)
- Root: `front-end`
- Build Command: `npm run build`
- Publish Directory: `dist`

### 4. Python Service (if needed)
- Deploy as a separate web service or background worker
- Root: `back-end`
- Start Command: `python mobilenet_faiss.py`

---

## Notes
- Make sure the backend uses `process.env.PORT` and listens on `0.0.0.0` for Render.
- Update CORS and API URLs for production.
- For local development, run all three services (frontend, backend, Python) separately.

---

## License
MIT 
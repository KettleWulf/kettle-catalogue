# 🫖 Kettle Catalogue API

A RESTful API for managing users, photo albums, and photos – built using Node.js, Express, TypeScript, and Prisma. This project supports user authentication with JWT, profile editing, and full CRUD operations for both albums and photos.

---

## 🚀 Tech Stack

- **Node.js + Express** – server and routing
- **TypeScript** – typed backend code
- **Prisma ORM** – database modeling with migrations
- **PostgreSQL** – relational database
- **JWT** – secure authentication
- **bcrypt** – password hashing
- **Express Validator** – input validation

---

## 📦 Features

### 🔐 Authentication
- `POST /register` – Register new users
- `POST /login` – Log in and receive access + refresh tokens
- `POST /refresh` – Refresh your access token
- `GET /profile` – View user profile
- `PATCH /profile` – Update profile info or password

### 📸 Photos
- `GET /photos` – View all photos
- `GET /photos/:id` – Get a specific photo
- `POST /photos` – Upload a new photo (URL-based)
- `PATCH /photos/:id` – Edit photo title or comment
- `DELETE /photos/:id` – Delete photo

### 📁 Albums
- `GET /albums` – List all albums
- `GET /albums/:id` – View album details
- `POST /albums` – Create a new album
- `PATCH /albums/:id` – Rename album
- `DELETE /albums/:id` – Delete album
- `POST /albums/:id/photos` – Add photos to an album
- `DELETE /albums/:id/photos/:photoId` – Remove photo from album

---

## 🧪 Testing the API

A full Postman collection is included:

📁 `Kettle Catalouge.postman_collection.json`  
➡️ Import this file into Postman to test all routes, including auth, photo and album operations.

---

## 🧰 Getting Started

```bash
# install dependencies
npm install

# apply schema with Prisma migrations
npx prisma migrate dev

# run the development server
npm run dev

Make sure to configure your .env file with:

DATABASE_URL

JWT_SECRET

JWT_REFRESH_SECRET

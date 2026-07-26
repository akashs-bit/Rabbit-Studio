# 🐰 Rabbit Studio

> A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application featuring secure authentication, full product management, user administration, and responsive UI design.

---

## 🚀 Live Demo
* **Live Application:** [https://rabbit-studio-drab.vercel.app](https://rabbit-studio-drab.vercel.app)

---

## ✨ Features

### 🔐 Authentication & Security
* Secure User Signup and Login with JWT (JSON Web Tokens) encryption.
* Email OTP verification workflow for enhanced security.
* Role-based access control (Admin vs. Standard User dashboards).

### 👥 User & Product Management (Admin Dashboard)
* Admin capability to view all registered users.
* Complete CRUD operations for managing products and inventory.
* Protected API endpoints guarded by custom authentication and authorization middleware.

### 🎨 UI & Design
* Built with **React** and styled for optimal user experience.
* Fully responsive layout optimized for desktop, tablet, and mobile viewports.
* Smooth UI animations and clean transition effects using CSS and JavaScript.

---

## 🛠️ Tech Stack

### **Frontend**
* **React.js** (Vite)
* **Axios** (for HTTP client requests)
* **Tailwind CSS / Custom CSS**
* **React Router**

### **Backend**
* **Node.js** & **Express.js**
* **MongoDB** & **Mongoose** (Database & ODM)
* **JWT** (Authentication)
* **CORS** & **Dotenv** (Security & Environment Configuration)

---

## 📂 Project Structure

```text
rabbit-studio/
│
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # View pages (Login, Dashboard, etc.)
│   │   └── App.jsx
│   └── package.json
│
└── backend/                  # Node.js & Express backend server
    ├── config/               # DB connection setup
    ├── controllers/          # Business logic handlers
    ├── middleware/           # Auth and role protection middleware
    ├── models/               # Mongoose database schemas
    ├── routes/               # API endpoint routing (user, product, order)
    ├── server.js             # Main entry point
    └── package.json

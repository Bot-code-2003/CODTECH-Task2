# One Piece Blog App

**Name:** Dharmadeep  
**Company:** CODTECH IT SOLUTIONS  
**Employee ID:** CT6FSWD597  
**Duration:** June to August  
**Domain:** Full Stack Web Development

## Overview

One Piece is a full-featured blog application where users can register, login, create, edit, delete, and like blog posts. The app provides a seamless and interactive user experience using modern web technologies.

## Features

- **User Authentication:**

  - Register and login using JSON Web Tokens (JWT) for secure authentication.
  - Passwords are securely hashed using bcrypt.

- **Blog Management:**
  - Post new blogs.
  - Browse all blogs.
  - Edit and delete own blogs.
  - Like blogs.

## Technologies Used

- **Frontend:**

  - React.js

- **Backend:**

  - Node.js
  - Express.js

- **Database:**

  - MongoDB

- **Authentication & Security:**
  - JSON Web Tokens (JWT)
  - bcrypt

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/one-piece-blog-app.git
   ```
2. **Install backend dependencies:**
   ```bash
   cd api
   npm install
   ```
3. **Install frontend dependencies:**
   ```bash
   cd ..
   cd client
   npm install
   ```
4. **In /api/index.js Give your MongoDB Cluster details**
5. **Start the backend server:**
   ```bash
   cd ..
   cd api
   node index.js
   ```
6. **Start the frontend development server:**
   ```bash
   cd ..
   cd client
   npm start
   ```

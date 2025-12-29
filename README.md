# LiveCodeEditor   - ( 13.200.243.168 )

A full-stack real-time code editor built using Node.js, Express, MongoDB, WebSockets, and JavaScript.
It allows users to create, edit, save, and manage documents with instant preview and cloud storage.
The project also includes authentication, AI support, and user project management.

---

## 🚀 Features

### ⭐ Core Editor

* Live HTML / CSS / JavaScript editor
* Real-time preview 
* Project save Changes
* File download support
* Clean and responsive UI

### 👤 Authentication

* User signup & login
* Forgot-password + reset password
* JWT-based session authentication

### 💾 User Projects

* Create new project
* Save project
* Load existing user projects
* Delete project

### 🤖 AI Features

* Ai suggestions (using Gemini API)

### 🔌 Realtime Features

* Socket.io live communication

---

## 🛠 Tech Stack

Frontend -  HTML, CSS, JavaScript
Backend  -  Node.js, Express.js
Database -  MongoDB with Mongoose 
Realtime -  Socket.io
Ai       -  Gemini API
Auth     -  JWT tokens, bcrypt hashing 
Other    -  Middleware, REST API routes 

---

## ⚙️ Installation & Setup

1️. Clone the repository

` git clone https://github.com/hemanth0banka/LiveCodeEditor.git
cd LiveCodeEditor `

2️. Install dependencies

` npm install `

3️. Create .env file

Add your environment variables:

`
MONGO_URI =
JWT_SECRET =
AI_API_KEY =
PORT = 3000
SALT = 10
SIB_SENDER_EMAIL = 
SIBAPIKEY =
`

4️. Start the server

` node app.js `

5️. Open in browser

` http://localhost:3000 `

---

## ⭐ Support

If you like this project, consider starring the repo ❤️


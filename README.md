# 🌐 **Kollab – Modern Social Media Platform**

<p align="center">
  <img src="https://img.shields.io/badge/Full%20Stack-MERN-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Auth-Clerk-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Workflow-Inngest-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Cloud-ImageKit-orange?style=for-the-badge" />
</p>

A **full-stack social media platform** built for collaboration. Kollab includes posts, real-time messaging, stories, user connections, profile updates, and secure authentication — powered by **Clerk**, **Inngest**, **MongoDB**, **React**, **Redux**, and **ImageKit**.

---

## 🔗 **Live Demo**
### 🌍 Frontend  
https://kollab-client.vercel.app  

### 🖥️ Backend  
https://kollab-server.vercel.app  

---

## ✨ **Features**

### 🔐 Authentication
- Clerk user authentication  
- JWT-based backend route protection  
- Secure middleware handling  

### 👤 User Features
- Update profile (profile + cover photos using ImageKit)  
- Follow / Unfollow  
- Send and accept connection requests  
- Discover users  
- View other user profiles  
- Get recent chat previews  

### 📝 Posts
- Create posts with up to **4 images**  
- Feed posts from connections  
- Like / Unlike posts  
- Cloud image upload via ImageKit  
- HTML content rendering  

### 💬 Messaging
- Real-time messaging using **Server-Sent Events (SSE)**  
- Image message support  
- Recent messages endpoint  
- Seen/unseen logic  

### 📸 Stories
- Add stories (image/video)  
- Fetch user stories  

### 🔔 Inngest Workflows
- Background jobs  
- Email / push notifications ready  

---

## 🛠️ **Tech Stack**

### 🧩 Frontend
- React.js  
- Redux Toolkit  
- Clerk React  
- React Router  
- Axios  
- TailwindCSS  

### 🔧 Backend
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- Clerk Express  
- Inngest  
- ImageKit SDK  

---

## 📁 **Project Structure**

### **Frontend**
```
client/
 ├── public/
 ├── src/
 │   ├── api/
 │   ├── assets/
 │   ├── components/
 │   ├── features/
 │   ├── pages/
 │   ├── main.jsx
 │   ├── index.css
 │   ├── vercel.json
 │   └── App.jsx
 └── package.json
```

### **Backend**
```
server/
 ├── configs/
 │   ├── db.js
 │   └── multer.js
 ├── controllers/
 ├── middlewares/
 ├── models/
 ├── routes/
 │   ├── user.route.js
 │   ├── post.route.js
 │   ├── message.route.js
 │   └── story.route.js
 ├── Inngest/
 ├── vercel.json
 ├── server.js
 └── package.json
```

---

# 🔌 **API Routes**

### 👤 **User Routes**
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/user/data` | Get logged-in user data |
| POST | `/api/user/update` | Update profile (profile + cover) |
| POST | `/api/user/discover` | Discover users |
| POST | `/api/user/follow` | Follow user |
| POST | `/api/user/unfollow` | Unfollow user |
| POST | `/api/user/connect` | Send connection request |
| POST | `/api/user/accept` | Accept connection request |
| GET | `/api/user/connections` | Get user connections |
| POST | `/api/user/profiles` | Get profile list |
| GET | `/api/user/recent-messages` | Get recent chat previews |

---

### 📝 **Post Routes**
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/post/add` | Add a new post |
| GET | `/api/post/feed` | Get feed posts |
| POST | `/api/post/like` | Like / Unlike post |

---

### 💬 **Message Routes**
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/message/:userId` | Real-time chat updates (SSE) |
| POST | `/api/message/send` | Send a message (supports ImageKit) |
| POST | `/api/message/get` | Fetch chat history |
| GET | `/api/message/recent-messages` | Fetch recent chat previews |

---

### 📸 **Story Routes**
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/story/create` | Add a story (image/video) |
| GET | `/api/story/get` | Fetch user stories |

---

### ⚙️ **Inngest Routes**
| Method | Route | Description |
|--------|-------|-------------|
| ANY | `/api/inngest/*` | Inngest event handler |

---

## ⚙️ **Environment Variables**

### Backend `.env`
```
# PORT
PORT=3500

# Frontend URL
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGO_URI=your mongo_uri

# Inngest
INNGEST_EVENT_KEY=your event key
INNGEST_SIGNING_KEY=your signing key

# Clerk
CLERK_PUBLISHABLE_KEY=your publishable key
CLERK_SECRET_KEY=your secret key

# ImageKit
IMAGEKIT_PUBLIC_KEY='your public key'
IMAGEKIT_PRIVATE_KEY='your private key'
IMAGEKIT_URL_ENDPOINT='endpoint'

# SMTP
SENDER_EMAIL=your email
SMTP_USER==your user
SMTP_PASS=your password
```

### Frontend `.env`
```
VITE_CLERK_PUBLISHABLE_KEY=your publishable key
VITE_BASE_URL=http://localhost:3500
```

---

## 🧪 **Run Locally**

### Backend
```sh
cd server
npm install
npm run server
```

### Frontend
```sh
cd client
npm install
npm run dev
```

---

## 📸 **Screenshots**

Login page

<img width="1439" height="818" alt="Screenshot 2025-11-29 at 10 54 47 PM" src="https://github.com/user-attachments/assets/e5c32cd9-3f13-4e90-a54b-569704c5e62e" /><br>

Feed page

<img width="1439" height="818" alt="Screenshot 2025-11-29 at 10 55 07 PM" src="https://github.com/user-attachments/assets/c0323a8d-88bc-433b-a70d-f8af8764c85e" /> <br> 

Messages page

<img width="1440" height="818" alt="Screenshot 2025-11-29 at 10 55 16 PM" src="https://github.com/user-attachments/assets/0772143e-7b48-4bb8-bbdc-5704a709f25c" /><br>

Connections page

<img width="1439" height="818" alt="Screenshot 2025-11-29 at 10 55 36 PM" src="https://github.com/user-attachments/assets/7e6847ad-0e50-458b-b0f5-fc11634c48b6" /><br>

Discover page

<img width="1438" height="817" alt="Screenshot 2025-11-29 at 10 55 47 PM" src="https://github.com/user-attachments/assets/7813d02f-1b32-438b-9fa8-2ae80c2824fc" /><br>

profile page

<img width="1439" height="818" alt="Screenshot 2025-11-29 at 10 56 59 PM" src="https://github.com/user-attachments/assets/f7822246-2cb8-493a-ad41-239056487955" /><br>

Edit profile page

<img width="1440" height="816" alt="Screenshot 2025-11-29 at 10 57 10 PM" src="https://github.com/user-attachments/assets/678d82be-0368-4e0b-a207-aeca0dfeed5a" /><br>

Create post page

<img width="1438" height="818" alt="Screenshot 2025-11-29 at 10 57 23 PM" src="https://github.com/user-attachments/assets/ab874953-7b51-4bd1-8dbe-e664cf921718" /><br>

Create Story page

<img width="1439" height="817" alt="Screenshot 2025-11-29 at 10 57 33 PM" src="https://github.com/user-attachments/assets/d8afe353-624a-44c3-89e0-a85af57e6a63" /><br>

Story viewer page

<img width="1440" height="819" alt="Screenshot 2025-11-29 at 10 57 44 PM" src="https://github.com/user-attachments/assets/9399baeb-121a-442c-9368-17dfcfa09538" /><br>

Chat page

<img width="1439" height="818" alt="Screenshot 2025-11-29 at 10 57 57 PM" src="https://github.com/user-attachments/assets/cf4b59ee-f724-4fa9-8f12-8dc3ae9e2c0e" /><br>

---

## 🚀 **Future Enhancements**
- Group Chats  
- AI-based feed recommendations  
- Post analytics dashboard  
- Video calling  

---

## 👩‍💻 **Author**

**Shreeja Vasala**  
📧 <shreevasala29@gmail.com>  
🔗 <https://www.linkedin.com/in/shreeja-vasala>  

---

## ⭐ **Support**
If you like this project, give it a ⭐ on GitHub!

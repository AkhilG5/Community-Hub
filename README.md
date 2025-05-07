# 🌐 Community Hub

A full-stack MERN application where users can discover educational content, engage with a curated feed, earn credit points for interaction, and access premium features — with admin/moderator capabilities and clean UI.

---

## ✨ Features

### 👤 User Authentication

* JWT-based Register/Login system
* Secured user session via token

### 💰 Credit Points System

* Earn credits for engaging with feed, watching content, or sharing
* Spend credits to unlock premium resources/events
* Transaction history with timestamp and purpose

### 📰 Feed Aggregator

* Aggregates content from Twitter, Reddit, LinkedIn
* Preview cards showing source, title, snippet
* Users can:

  * Save content for later
  * Share posts
  * Report (flag) inappropriate content

### 🛠️ Admin/Moderator Panel

* Review reported posts
* View analytics: top saved content, active users
* Manage flagged content or user activity

### 🛆 Tech Stack

* **Frontend:** HTML, CSS, JS (Simple version)
* **Backend:** Express.js + MongoDB
* **Authentication:** JWT
* **Database:** MongoDB Atlas
* **Deployment:** GitHub repo (manual upload); GCP optional

---

## 🛠️ Installation (Local Setup)

```bash
# 1. Clone the repo
git clone https://github.com/your-username/community-hub.git
cd community-hub

# 2. Install server dependencies
cd community-hub-backend
npm install

# 3. Create .env file
touch .env
```

### Sample `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
# 4. Start the backend server
node server.js
```

```bash
# 5. Open frontend
Just open `register.html`, `login.html`, or `dashboard.html` in browser
```

---

## 🌍 Deployment

### GitHub

* Upload the project excluding `node_modules/`
* Add `.gitignore` with:

  ```bash
  node_modules/
  .env
  ```

### GCP (Optional)

* Enable App Engine
* Deploy via App Engine + MongoDB Atlas

---

## 📁 Folder Structure

```
community-hub/
🔺 community-hub-backend/
│   🔺 models/
│   🔺 routes/
│   🔺 middleware/
│   🔺 server.js
│   🔺 .env
🔺 frontend/
│   🔺 register.html
│   🔺 login.html
│   🔺 dashboard.html
│   🔺 admin.html
│   🔺 script.js
│   🔺 style.css
🔺 README.md
```

---

## 📊 Evaluation Criteria

* ✅ All core features implemented
* ✅ Clean, modular code with proper naming
* ✅ Responsive frontend (HTML/JS)
* ✅ GitHub repo with working backend
* ✅ Optional GCP deployment ready

---

## 📌 Extras (Optional)

* Redis caching for feed (in progress)
* Notification system (coming soon)

<div align="center">

# 🍱 SWAAD
### *Ghar jaisa khana, ab har jagah.*

Home-cooked food, delivered by neighbours who actually know how to cook.

[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

**[📽️ Watch Full Demo](https://drive.google.com/file/d/18nFrW8EoCRhuaRIZI0cLQSocODuSb9Cr/view?usp=drive_link)**

<br/>

![SWAAD Home Page](screenshots/home.jpeg)

</div>

---

## 💡 The Idea

You know that feeling when you eat at a restaurant and think — *"my neighbour's aloo sabzi is better than this"*?

That's exactly what SWAAD is about.

We built a platform that lets talented home chefs — the aunties, the home cooks, the tiffin walas — share their food with people nearby. And for customers, it's not just food delivery. It's a subscription to someone's kitchen. Real food, made with care, delivered within 10 km.

We also threw in an **AI chatbot** because, honestly, ordering food should be as easy as texting a friend.

---

## 🖼️ Screenshots

### Landing Page — First impressions matter

![Home Page](screenshots/home.jpeg)

The hero copy says it all: *"Ghar jaisa khana, ab har jagah."* Clean, warm, and inviting — just like the food itself.

---

### Sign In — Three roles, one login page

![Login Page](screenshots/login.jpeg)

Customers, Chefs, and Delivery Partners all log in from the same screen but land on completely different dashboards. Role-based routing handled seamlessly with Firebase Auth.

---

### Explore Page — Browse like you're walking through a food market

![Explore Page](screenshots/explore.jpeg)

Filter by cuisine type — Pure Veg, Non-Veg, Heavy Meals, Light/Sattvic, or Budget Pick. Each card shows the chef's name, their kitchen, ratings, and price per meal. Clean. No clutter.

---

### Chef Dashboard — The command centre

![Chef Dashboard](screenshots/chef-dashboard.jpeg)

Every chef gets their own kitchen dashboard. Live orders, subscriber count, ratings, monthly earnings — everything at a glance. The `CHEF-BGY6` invite code is how delivery partners link to a specific kitchen. Simple but clever.

---

### Earnings Dashboard — Built for real chefs

![Earnings Dashboard](screenshots/earnings.jpeg)

Total earnings, active subscribers, next payout date — all live from the backend. This screen alone convinced our examiner that the platform has real-world potential.

---

### AI Chatbot — For every question a user shouldn't have to Google

![AI Chatbot](screenshots/chatbot.jpeg)

The Partner Support chatbot handles delivery issues in plain language. "I am not able to connect my customer" → it responds with actionable steps and even mentions the SOS option. No FAQ pages needed.

---

### Link with Kitchen — Delivery partner onboarding

![Link with Kitchen](screenshots/link-kitchen.jpeg)

Delivery partners enter a `CHEF-XXXX` invite code shared by the chef. One modal, zero friction. This keeps the chef-partner relationship direct and trust-based.

---

### College Evaluation — Examiner Feedback Form

![Examiner Feedback](screenshots/feedback.jpeg)

Evaluated at **Shree L.R. Tiwari College of Engineering** during our T.E. project presentation (A.Y. 2025–26).

> *"Strengths: Real Time Data Usage & Admin Roles"*
> *"Suggestions: Customer specific order restrict"* — Hitesh Mevada (Examiner)

Scored **Excellent** in: Quality of Problem, Effective Use of Skill Sets, Contribution as Team Leader, and Clarity in Communication.

---

## 🛠️ Tech Stack

| Layer | What we used | Why |
|-------|-------------|-----|
| **Frontend** | React + Vite + PostCSS | Fast dev, clean component structure |
| **Backend** | Node.js + Express.js | Simple REST API layer |
| **Database** | Firebase Firestore | Real-time sync across all 3 user roles |
| **Auth** | Firebase Authentication | Role-based login out of the box |
| **AI Chatbot** | NLP-based conversational engine | Context-aware support for all user types |
| **Dev Tools** | Nodemon, ESLint, dotenv | Clean dev workflow |

---

## 📁 Project Structure

```
SWAAD--Home-Made-Food/
│
├── backend/                  # Node.js + Express server
│   ├── src/                  # Routes, controllers, middleware
│   ├── scripts/              # Helper scripts
│   ├── test-fb.js            # Firebase connection test
│   ├── nodemon.json
│   └── package.json
│
├── frontend/                 # React + Vite client
│   ├── public/               # Static assets
│   ├── src/                  # Pages, components, hooks, context
│   ├── index.html
│   ├── postcss.config.js
│   └── package.json
│
└── screenshots/              # README images (this folder)
```

---

## ⚙️ Running it Locally

### What you need
- Node.js v18+
- A Firebase project (Firestore + Auth enabled)

### Setup

```bash
# Clone the repo
git clone https://github.com/kunalcse27/SWAAD--Home-Made-Food-.git
cd SWAAD--Home-Made-Food-
```

**Backend**
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

```bash
npm run dev
```

**Frontend**
```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_BACKEND_URL=http://localhost:5000
```

```bash
npm run dev
# → http://localhost:5173
```

---

## 👥 User Roles — Three dashboards, one platform

| Role | What they see |
|------|--------------|
| 🧑 **Customer** | Browse chefs nearby, subscribe to meals, AI chatbot, order history |
| 👨‍🍳 **Chef** | Menu management, live orders, earnings, subscriber list, invite codes |
| 🚴 **Delivery Partner** | Linked kitchens, active deliveries, partner support chatbot |

---

## 🏆 Recognition

- 🎓 **Evaluated by external examiner** at Shree L.R. Tiwari College of Engineering — A.Y. 2025–26
- 📋 Scored **Excellent** in Problem Quality, Skill Usage, Leadership & Communication
- 💬 Examiner highlighted: *"Real Time Data Usage & Admin Roles"* as key strengths

---

## 👨‍💻 Team

| Name | Role | GitHub |
|------|------|--------|
| Kunal Kumar | Team Leader & Full Stack Dev | [@kunalcse27](https://github.com/kunalcse27) |
| Ajeet Mishra | Developer | [@AjeetMishra01](https://github.com/AjeetMishra01) |
| Suraj Sah | Developer | — |
| Sharvya Shetty | Developer | — |

---

## 📽️ Demo

**[▶️ Watch the full walkthrough](https://drive.google.com/file/d/11tJNTv-28B13BMkjKvCL08JfGxycn_AR/view?usp=drive_link)**

---

<div align="center">

Built with chai ☕, code 💻, and a lot of hunger 🍛

*T.E. Computer Engineering — Shree L.R. Tiwari College of Engineering, Mumbai (2025–26)*

</div>


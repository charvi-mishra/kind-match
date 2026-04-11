# 💚 KindMatch — Find Your Kind in GenZ Terms

A full-stack dating app built with the MERN stack that matches people based on psychological wound compatibility and shared mental health experiences.

---

## 🧠 How the Matching Works

### Parental Scale
Users rate themselves on a 0–100 scale between "Mom energy" and "Dad energy":
- **Tends to Mom (0–50):** `visible_wound = dad` · `hidden_wound = mom`
- **Tends to Dad (51–100):** `visible_wound = mom` · `hidden_wound = dad`

### Recommendation Algorithm (Priority Order)
1. **Opposite hidden wound** (40 pts) — highest priority
2. **Opposite visible wound** (30 pts)
3. **Similar mental disorders** (up to 20 pts)
4. **Similar age group** (up to 7 pts)
5. **Similar occupation** (3 pts)

### Swipe Mechanics
- **Swipe LEFT** = Match (like) 💚
- **Swipe RIGHT** = Pass ✗
- Mutual likes = KindMatch! 🎉

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + Firebase (Google sign-in) |
| Styling | Custom CSS with CSS Variables |
| Fonts | Syne + DM Sans (Google Fonts) |

---

## 📁 Project Structure

```
kindmatch/
├── backend/
│   ├── models/
│   │   └── User.js          # User schema + wound calculation
│   ├── routes/
│   │   ├── auth.js          # Register, login, /me
│   │   ├── profile.js       # Getting-to-know, profile update
│   │   ├── matches.js       # Recommendation algorithm
│   │   └── swipe.js         # Like/dislike + mutual match
│   ├── middleware/
│   │   └── auth.js          # JWT verification
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── config/
    │   │   └── firebase.js   # Firebase setup
    │   ├── context/
    │   │   └── AuthContext.js # Global auth state
    │   ├── pages/
    │   │   ├── LandingPage.js
    │   │   ├── SignUpPage.js
    │   │   ├── SignInPage.js
    │   │   ├── GettingToKnowPage.js
    │   │   ├── DiscoverPage.js
    │   │   └── MatchesPage.js
    │   ├── components/
    │   │   └── Navbar.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── .env.example
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Firebase project (for Google sign-in)

### 1. Clone & Install

```bash
# Backend
cd kindmatch/backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** — copy `.env.example` to `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/kindmatch
JWT_SECRET=1f78d8957e5e3269a344467279d3d842dea3edf1678300dd0ed70ca856c5cca74af04db2efbd8cac8d7bc5a32f1eb919ff23d94d0561f9276ab8e1a5dc2d1a8a
NODE_ENV=development
```

**Frontend** — copy `.env.example` to `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

> **Note:** The app runs without Firebase configured — Google sign-in just shows a setup prompt. Email/password auth works fully without Firebase.

### 3. Start MongoDB

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas — paste the connection string in MONGO_URI
```

### 4. Run the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev     # or: npm start

# Terminal 2 — Frontend
cd frontend
npm start
```

Visit: **http://localhost:3000**

---

## 🔐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user (JWT required) |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/profile/getting-to-know` | Save parental scale + disorders |
| PUT | `/api/profile/update` | Update bio, age, photos |
| GET | `/api/profile/disorders-list` | Get all disorder options |

### Matches
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/matches/recommendations` | Get scored recommendations |
| GET | `/api/matches/my-matches` | Get mutual matches |

### Swipe
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/swipe/like` | Like a user (checks for mutual match) |
| POST | `/api/swipe/dislike` | Pass on a user |

---

## 🧬 User Schema Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Required |
| `email` | String | Required, unique |
| `country` | String | Required |
| `occupation` | String | **Nullable if unemployed** |
| `isUnemployed` | Boolean | Makes occupation null |
| `password` | String | Bcrypt hashed, obscured in UI |
| `parentalScaleResult` | Number 0–100 | 0=mom, 100=dad |
| `identifiesMoreAs` | mom/dad | Derived from scale |
| `visibleWound` | mom/dad | Opposite of identity |
| `hiddenWound` | mom/dad | Same as identity |
| `mentalDisorders` | String[] | From 25-item checklist |
| `liked` | ObjectId[] | Users swiped left on |
| `disliked` | ObjectId[] | Users swiped right on |
| `matches` | ObjectId[] | Mutual likes |

---

## 🎨 Design System

- **Primary color:** `#00ff87` (electric green)
- **Background:** `#0a0a0a` (near-black)
- **Display font:** Syne (800 weight)
- **Body font:** DM Sans
- **Aesthetic:** Dark, Gen Z, raw honesty

---

## 📱 Features

- ✅ Responsive design (mobile-first)
- ✅ Touch/swipe gestures on mobile
- ✅ Mouse drag-to-swipe on desktop
- ✅ Animated card stack
- ✅ Match celebration popup
- ✅ Password visibility toggle
- ✅ Password match validation
- ✅ Occupation nullable when unemployed
- ✅ Firebase Google sign-in (requires setup)
- ✅ JWT authentication with 30-day expiry
- ✅ Protected routes

---

## 🔮 Extending the App

Ideas for future features:
- Real-time messaging (Socket.io)
- Photo upload (Cloudinary/S3)
- Push notifications
- Therapy resource recommendations
- Anonymous mood check-ins
- Group spaces by disorder

---

*Built with 💚 for the emotionally self-aware generation*

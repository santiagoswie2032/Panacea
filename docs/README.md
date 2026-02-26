# Panacea — Medical Assistance PWA

> Your personal medical assistant. Track medications, store health documents, and stay safe with Emergency SOS.

## 🏗️ Architecture

```
Panacea/
├── frontend/          # React + Vite PWA
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-level pages
│   │   ├── services/     # API client, notifications, offline
│   │   ├── context/      # React Context (auth, toast)
│   │   └── assets/       # Icons, images
│   └── public/           # PWA manifest, icons, offline page
│
├── backend/           # Node.js + Express API
│   └── src/
│       ├── routes/       # Express route definitions
│       ├── controllers/  # Request handlers
│       ├── services/     # Business logic (notifications, cron)
│       ├── models/       # Mongoose schemas
│       ├── middlewares/  # Auth, error handling, file upload
│       └── config/       # Environment, database
│
├── shared/            # Shared code
│   ├── types/           # Type definitions & constants
│   └── utils/           # Utility functions
│
└── docs/              # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
cp .env.example .env    # Configure your environment
# make sure FRONTEND_URL points to whatever frontend domain you'll use
# (e.g. https://your-app.vercel.app).  You can also provide a
# comma-separated list if you need to allow multiple origins.
npm install
npm run dev             # Starts on :5000
```

### Frontend
```bash
cd frontend
npm install
# when deploying, set VITE_API_BASE to your backend URL (e.g.
# https://panacea-backend.vercel.app).  If the backend lives in the
# same Vercel project under `/api`, you can omit the variable because
# our code will fall back to using the Vercel URL automatically.
npm run dev             # Starts on :5173
```

The frontend dev server proxies `/api/*` requests to `localhost:5000`.

## 📱 Pages

| Page | Path | Description |
|------|------|-------------|
| Login / Register | `/login` | JWT-based authentication |
| Home Dashboard | `/` | Today's schedule, stats, low-stock alerts |
| Medications | `/medications` | Full medication list with CRUD |
| Documents | `/documents` | Upload/manage medical documents by category |
| Emergency SOS | `/emergency` | One-tap emergency call, patient info |
| Profile | `/profile` | Personal details, emergency contact, notifications |

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get authenticated user |
| GET | `/api/medications` | ✅ | List user's medications |
| POST | `/api/medications` | ✅ | Add medication |
| PUT | `/api/medications/:id` | ✅ | Update medication |
| DELETE | `/api/medications/:id` | ✅ | Delete medication |
| POST | `/api/medications/dose/take` | ✅ | Mark dose as taken |
| GET | `/api/medications/schedule/today` | ✅ | Today's schedule |
| GET | `/api/documents` | ✅ | List documents |
| POST | `/api/documents/upload` | ✅ | Upload document (multipart) |
| PUT | `/api/documents/:id` | ✅ | Rename document |
| DELETE | `/api/documents/:id` | ✅ | Delete document |
| GET | `/api/documents/:id/download` | ✅ | Download/preview |
| GET | `/api/users/profile` | ✅ | Get profile |
| PUT | `/api/users/profile` | ✅ | Update profile |
| GET | `/api/users/emergency` | ✅ | Get emergency info |
| PUT | `/api/users/emergency` | ✅ | Update emergency info |
| POST | `/api/notifications/subscribe` | ✅ | Save push subscription |
| POST | `/api/notifications/unsubscribe` | ✅ | Remove push subscription |

## 🔔 Notifications Architecture

### Push Notifications (Primary)
- Uses **Web Push API** with **VAPID keys**
- Backend runs a **cron scheduler** every minute checking for medication timings
- When a timing matches, sends push notification via `web-push`
- Missed doses are auto-marked hourly

### Local Notifications (Fallback)
- When the PWA is open, `setTimeout`-based reminders are scheduled
- Works even without a Push subscription
- Limited: only works while the app tab is active

### Offline Handling
- Notifications are a known PWA limitation when offline/closed
- **Workaround**: The cron scheduler runs server-side, so push notifications work as long as the device has internet — the PWA doesn't need to be open
- When truly offline: the schedule is cached and shown from IndexedDB/service worker cache

## 📲 Capacitor Wrapping

This app is designed for easy wrapping with Capacitor:

```bash
# In the frontend directory
npm run build
npx cap init Panacea com.panacea.app
npx cap add android
npx cap sync
npx cap open android
```

### Capacitor-Ready Design Decisions
- No `window.open()` or browser-only APIs
- Safe area insets via `env()` CSS
- Touch targets ≥ 48px
- No hover-dependent interactions
- `tel:` links for native phone calling
- Standalone display mode in manifest
- Portrait orientation lock

## 🎨 Design Decisions

| Decision | Rationale |
|----------|-----------|
| Dark theme | Reduces eye strain for medical contexts, premium feel |
| Large touch targets (48px+) | Elderly-friendly, accessible |
| High contrast text | WCAG AA compliance for readability |
| Glassmorphism cards | Modern, depth without clutter |
| Bottom navigation | One-handed operation, native app feel |
| Persistent SOS button | Always accessible in emergencies |
| Staggered animations | Contemporary feel without compromising performance |

## 🔒 Security

- JWT tokens with configurable expiry
- bcrypt password hashing (12 rounds)
- Helmet.js security headers
- Rate limiting (100 req / 15 min)
- Per-user file storage isolation
- File type validation for uploads
- CORS restricted to frontend origin

## License

MIT

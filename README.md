## Voygr – Intelligent Travel Route Optimizer

Voygr helps travelers plan multi-destination trips without the spreadsheet chaos. Add every place you want to visit, and Voygr calculates the smartest way to reach them—optimizing for distance or time with advanced pathfinding algorithms and live Google Maps data.

---

## 1. Problem Statement

Travelers often struggle to efficiently plan multi-stop journeys. Manually comparing routes, distances, and drive times is tedious, error-prone, and rarely accounts for real-world traffic data. Voygr lets users pin their must-visit locations, automatically evaluates the best order using A* or Dijkstra, and overlays the route on an interactive Google Map. The result is a customizable itinerary that balances speed and convenience while staying easy to understand.

---

## 2. System Architecture

```
Next.js Frontend → Express API Layer → PostgreSQL (Supabase)
                           ↓
                    Supabase Auth (JWT)
                           ↓
                   Google Maps API Integration
```

- **Frontend:** Next.js with TailwindCSS and Shadcn UI components for responsive, accessible screens.
- **Backend:** Node.js with Express (or Next.js API Routes) delivering REST endpoints for auth, places, and optimization.
- **Database:** PostgreSQL hosted on Supabase, persisting profiles, routes, and preferences.
- **Authentication:** Supabase Auth issuing JWTs, validated on every protected API call.
- **External APIs:** Google Maps API for geocoding, routing, and drive-time data.
- **Hosting:** Frontend deployed on Vercel, backend on Render, database managed by Supabase.

---

## 3. Key Features

| Category | Features |
| --- | --- |
| Authentication & Authorization | JWT-based signup, login, logout, and profile management via Supabase Auth. |
| Route Optimization | Add multiple destinations, choose quickest or shortest route, run A* or Dijkstra to compute the optimal path. |
| Integration | Google Maps API for live map rendering and updated distance/time calculations. |
| CRUD Operations | Create, read, update, delete saved routes and individual places. |
| Frontend Routing | Pages for Home, Login/Signup, Map, Profile, History, and Feedback. |
| UI & UX | Modern responsive UI powered by Shadcn UI primitives plus TailwindCSS. |
| Data Management | Persist user profiles, route history, preferences, and feedback in Supabase PostgreSQL. |
| Hosting | Frontend on Vercel, backend on Render, database on Supabase for managed PostgreSQL. |

---

## 4. Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js, TailwindCSS, Shadcn UI, Axios |
| Backend | Node.js, Express (or Next.js API Routes) |
| Database | PostgreSQL (Supabase) |
| Authentication | Supabase Auth / JWT |
| Pathfinding Algorithms | A* Algorithm, Dijkstra Algorithm |
| API Integration | Google Maps API |
| Hosting | Frontend – Vercel, Backend – Render, Database – Supabase |

---

## 5. API Overview

| Endpoint | Method | Description | Access |
| --- | --- | --- | --- |
| `/api/auth/signup` | POST | Register new user | Public |
| `/api/auth/login` | POST | Authenticate user | Public |
| `/api/places` | POST | Add new place | Authenticated |
| `/api/places` | GET | Get all places for a user | Authenticated |
| `/api/places/:id` | PUT | Update a place | Authenticated |
| `/api/places/:id` | DELETE | Delete a place | Authenticated |
| `/api/routes/optimize` | POST | Compute shortest route via A* / Dijkstra | Authenticated |
| `/api/feedback` | POST | Submit feedback | Authenticated |

---

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000` for the frontend UI. Configure `NEXT_PUBLIC_API_URL` to point to the deployed backend on Render.

---

## Deployment Checklist

- Supabase project configured with tables for users, places, routes, feedback.
- Environment variables set locally and in Vercel/Render (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GOOGLE_MAPS_API_KEY`, `JWT_SECRET`, etc.).
- Database migrations executed via Supabase SQL or Prisma migrations.
- Frontend deployed to Vercel with automatic preview deployments.
- Backend deployed to Render with health checks and logging enabled.

## HOSTED LINK
-frontend : -https://mepa.vercel.app/

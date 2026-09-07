# EthioMeetGreet 🌟
### Cameo-Style Meet & Greet Platform for Ethiopian Stars & Creators

A full-stack, 100% Dockerized video shoutout and 1-on-1 virtual meet & greet booking platform styled with Cameo's signature vibrant dark-mode aesthetics.

---

## 🚀 Quick Start (Docker Only)

The application runs entirely in Docker. No host runtimes (Node, Python, Postgres) are needed.

```bash
# Clone the repository
git clone https://github.com/AbelAshine1234/EthioMeetGreet.git
cd EthioMeetGreet

# Start all services (Database, Backend API, and Frontend UI)
docker compose up --build -d
```

Once running:
- 🌐 **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- 🔌 **Backend REST API**: [http://localhost:5050](http://localhost:5050)
- 📊 **API Health Check**: [http://localhost:5050/api/health](http://localhost:5050/api/health)
- 🗄️ **PostgreSQL Database**: Port `5432` (`ethiomeetgreet` database)

To shut down:
```bash
docker compose down
```

---

## ✨ Features

- **Cameo-Inspired Aesthetic**: Sleek dark UI with vibrant Cameo-pink/coral accents, glowing cards, rating badges, response-time pills, and video hover previews.
- **Pre-Seeded Roster of Ethiopian Icons**: Preloaded with realistic profiles (Teddy Afro, Aster Aweke, Rophnan, Danayit Mekbib, Haile Gebrselassie, Meskerem Abera, Derartu Tulu, and more) with intro videos, ratings, and verified badges.
- **Dual Booking Types**:
  - 🎥 **Personalized Video Shoutouts**: Custom greetings, birthdays, holidays (Enkutatash, Genna), graduations, or roasts.
  - 📞 **1-on-1 Live Meets**: 10-minute interactive live video sessions.
- **Interactive Multi-Step Booking Wizard**:
  - Target audience selector (Myself, Friend/Family, Brand/Business).
  - Occasion selector chips (Birthday, New Year, Wedding, Pep talk, Roast).
  - Detailed shoutout instructions.
  - Delivery speed options (Standard 3-5 days vs ⚡ 24-Hour Express delivery).
  - Dual Currency support ($ USD and Ethiopian Birr ETB).
- **Fan Order Tracking**:
  - Track requests in real time (`Pending`, `In Progress`, `Completed`, `Declined`).
  - Watch completed personalized videos directly in the in-app player or download HD copies.
- **Creator Studio / Fulfill Hub**:
  - Celebrities and managers can accept/decline booking requests.
  - Upload completed video links and personal notes to fans.
  - Track total earnings and queue stats.
- **Self-Service Star Enrollment**: Creators can enroll their profile directly with categories, prices, bios, and tags.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Containerization** | Docker, Docker Compose |
| **Backend** | Node.js (v20), Express, TypeScript, `pg` Pool, Zod validation |
| **Database** | PostgreSQL 16 Alpine, automated migrations & seeds on startup |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti |

---

## 📁 Repository Structure

```
EthioMeetGreet/
├── docker-compose.yml       # Orchestrates db, backend, and frontend containers
├── .env.example             # Environment variable template
├── .env                     # Local environment configuration
├── backend/
│   ├── Dockerfile           # Multi-stage Node.js container
│   ├── package.json         # Express & TypeScript dependencies
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts        # Express app entry & route mounting
│       ├── db/
│       │   ├── index.ts     # PostgreSQL connection pool with retry logic
│       │   ├── schema.sql   # Relational tables (talents, categories, bookings, reviews)
│       │   └── init.ts      # Automatic migration runner and rich dataset seeder
│       └── routes/
│           ├── talents.ts   # GET /api/talents, GET /api/talents/:id, POST /api/talents
│           ├── categories.ts# GET /api/categories, GET /api/categories/occasions
│           ├── bookings.ts  # POST /api/bookings, GET /api/bookings, PATCH /api/bookings/:id/status
│           └── reviews.ts   # POST /api/reviews
└── frontend/
    ├── Dockerfile           # Vite dev container
    ├── package.json         # React 18, Tailwind, Lucide Icons
    ├── tailwind.config.js   # Cameo color palette & typography
    ├── vite.config.ts       # Docker host-binding on port 3000
    └── src/
        ├── App.tsx          # Main Cameo layout, featured rows, grids, and modal orchestration
        ├── api.ts           # Type-safe API client
        ├── types.ts         # TypeScript data contracts
        └── components/
            ├── Navbar.tsx             # Header, live search, currency toggle, badges
            ├── HeroBanner.tsx         # Cameo spotlight, trending chips, value props
            ├── CategoryBar.tsx        # Category filters (Music, Cinema, Comedy, Sports, Culture)
            ├── TalentCard.tsx         # Video hover preview, rating badges, dual pricing
            ├── TalentDetailModal.tsx  # Video showcase player, bio, fan reviews
            ├── BookingModal.tsx       # Multi-step booking wizard with confetti celebration
            ├── BookingsTrackerModal.tsx # Order tracking & in-app video playback
            ├── CreatorStudioModal.tsx # Creator portal: fulfill orders & track earnings
            └── JoinTalentModal.tsx    # Star registration form
```

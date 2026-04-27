# Angaza Dryland Value Chains

Mobile-first digital ecosystem for dryland value chains — Baobab, Tamarind & wild cotton.

> Built for Angaza Tree Company Limited, Makueni County, Kenya. Connecting rural harvesters (women & youth) with local and international markets while incentivising tree conservation through economic value.

---

## Modules (MVP)

| Module | Description |
|---|---|
| **Product Encyclopedia** | Species info, harvesting calendars, nutrition & processing methods |
| **Training Hub** | Video tutorials in Swahili & English with badge quizzes |
| **Marketplace** | Product listings, price guidance, buyer inquiry forms |
| **Collection Point Map** | OpenStreetMap markers for pickup zones, warehouses & buyer zones |
| **Harvester Registration** | Digital ID, delivery tracking, admin dashboard |
| **AI Trade Advisor** | Bilingual (Swahili/English) Claude-powered farming & trade assistant |

## Stack

| Layer | Technology |
|---|---|
| Frontend | Nuxt 4 + Vue 3 + TailwindCSS + PrimeVue 4 (unstyled) |
| Backend | NestJS 11 + TypeORM 0.3 + PostgreSQL 16 |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| Maps | Leaflet 1.9 + OpenStreetMap |
| Auth | Passport.js + JWT (cookie-based) |
| i18n | @nuxtjs/i18n — English & Swahili |
| Monorepo | pnpm workspaces |
| Dev Infra | Docker Compose (PostgreSQL) + run.sh task runner |
| Deployment | Railway (target) |

## Prerequisites

- Node.js 22+
- pnpm 9+
- Docker Desktop

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/Josephnyingi/angaza-dryland.git
cd angaza-dryland

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 4. Start everything
./run.sh dev
```

The app will be available at:
- **Web** → http://localhost:3000
- **API** → http://localhost:3003
- **API Docs (Swagger)** → http://localhost:3003/api/docs

## Developer Commands

```bash
./run.sh dev          # Start PostgreSQL + API + Web
./run.sh dev:api      # Start PostgreSQL + API only
./run.sh dev:web      # Start web only
./run.sh dev:stop     # Stop all services
./run.sh db:shell     # Open PostgreSQL shell
./run.sh db:seed      # Seed database with sample data
./run.sh help         # List all commands
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `POSTGRES_HOST` | PostgreSQL host | `localhost` |
| `POSTGRES_PORT` | PostgreSQL port (host-mapped) | `5433` |
| `POSTGRES_DB` | Database name | `angaza` |
| `POSTGRES_USER` | Database user | `angaza` |
| `POSTGRES_PASSWORD` | Database password | `changeme` |
| `PORT` | API server port | `3003` |
| `JWT_SECRET` | JWT signing secret | *(set this)* |
| `ANTHROPIC_API_KEY` | Claude API key | *(required for AI advisor)* |
| `NUXT_PUBLIC_API_BASE` | API base URL for frontend | `http://localhost:3003` |

## Project Structure

```
angaza-dryland/
├── api/                        # NestJS 11 backend
│   └── src/
│       ├── auth/               # JWT auth, guards, strategies
│       ├── users/              # User profiles & roles
│       ├── products/           # Product encyclopedia
│       ├── training/           # Training modules & completions
│       ├── marketplace/        # Listings, inquiries, price guide
│       ├── map/                # Collection point data
│       └── ai/                 # Claude AI trade advisor
├── web/                        # Nuxt 4 frontend
│   ├── pages/                  # App pages (encyclopedia, training, marketplace, map…)
│   ├── components/             # Shared components (AppAIAdvisor, ProductCard…)
│   ├── composables/            # useApi, useAuth
│   ├── layouts/                # Default mobile-first layout
│   └── i18n/locales/           # en.json + sw.json translations
├── docs/
│   └── ARCHITECTURE.md         # System design & data flow
├── docker-compose.dev.yaml     # PostgreSQL dev container
├── pnpm-workspace.yaml         # pnpm monorepo config
├── run.sh                      # Developer task runner
└── .env.example                # Environment variable template
```

## User Roles

| Role | Access |
|---|---|
| **Harvester** | Registration, training, encyclopedia, list products, view map |
| **Buyer** | Browse marketplace, send inquiries, view price guide |
| **Admin** | Full dashboard, user management, price updates, content |

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create account |
| POST | `/auth/login` | Public | Get JWT token |
| GET | `/auth/me` | JWT | Current user |
| GET | `/products` | Public | Product encyclopedia |
| GET | `/training` | Public | Training modules |
| POST | `/training/:id/complete` | JWT | Complete a module |
| GET | `/marketplace/listings` | Public | Browse listings |
| POST | `/marketplace/listings` | JWT (Harvester) | Create listing |
| GET | `/marketplace/prices` | Public | Current price guide |
| GET | `/map/points` | Public | Collection point markers |
| POST | `/ai/chat` | JWT | AI trade advisor |

## Target Users

- **Jane** — Rural harvester, basic smartphone, watches training videos, checks collection points
- **Joseph** — Youth aggregator, uses map to coordinate suppliers, lists bulk quantities
- **Grace** — Local buyer (Nairobi health store), searches for certified baobab powder
- **International buyers** — UK/US importers viewing quality docs and sending inquiries
- **Angaza admin** — Manages users, posts prices, approves listings, tracks inventory

## Roadmap

- **Phase 1 (MVP)** — Encyclopedia, training, marketplace, map, registration *(in progress)*
- **Phase 2** — M-Pesa payments, AI quality grading via photo, certification tracker
- **Phase 3** — Multi-country expansion, carbon credit tracking, predictive harvest planning

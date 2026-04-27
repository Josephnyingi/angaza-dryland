# Angaza Dryland Value Chains

Mobile-first digital ecosystem for dryland value chains — Baobab, Tamarind & wild cotton.

## Overview

Angaza connects rural harvesters (women & youth) in Makueni County, Kenya with local and international markets for dryland products, while incentivising tree conservation through economic value.

## Modules (MVP)

- **Product Encyclopedia** — Species info, harvesting calendars, nutrition & processing
- **Training Hub** — Offline-capable video tutorials in Swahili & English with badge quizzes
- **Marketplace** — Product listings, price guidance, buyer inquiry forms
- **Collection Point Map** — OpenStreetMap markers for pickup zones and warehouses
- **Harvester Registration** — Digital ID, delivery tracking, admin dashboard
- **AI Trade Advisor** — Bilingual (Swahili/English) farming & trade assistant

## Stack

| Layer | Technology |
|---|---|
| Frontend | Nuxt 4 + Vue 3 + TailwindCSS + PrimeVue |
| Backend | NestJS 11 + TypeORM + PostgreSQL |
| AI | Anthropic Claude API |
| Maps | Leaflet + OpenStreetMap |
| Auth | Passport.js + JWT |
| Monorepo | pnpm workspaces |
| DevOps | Docker Compose + Railway |

## Getting Started

```bash
cp .env.example .env
pnpm install
pnpm dev
```

## Structure

```
angaza-dryland/
├── api/          # NestJS backend
├── web/          # Nuxt 4 frontend
├── docs/         # Project documentation
└── docker-compose.dev.yaml
```

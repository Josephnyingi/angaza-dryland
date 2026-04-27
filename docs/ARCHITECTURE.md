# Architecture

## System Overview

```
┌─────────────────────────────────────────────┐
│                  Web (Nuxt 4)               │
│  Encyclopedia | Training | Marketplace      │
│  Map | Registration | AI Advisor            │
└────────────────────┬────────────────────────┘
                     │ HTTP / WebSocket
┌────────────────────▼────────────────────────┐
│               API (NestJS 11)               │
│  Auth | Products | Marketplace | Training   │
│  Users | Map | AI (Claude)                  │
└──────┬─────────────────────────┬────────────┘
       │                         │
┌──────▼──────┐         ┌────────▼────────┐
│ PostgreSQL  │         │  Anthropic API  │
│  (primary)  │         │ (AI Advisor)    │
└─────────────┘         └─────────────────┘
```

## User Roles

| Role | Access |
|---|---|
| **Harvester** | Registration, training, encyclopedia, marketplace listings, map |
| **Buyer** | Marketplace browsing, inquiries, price guidance |
| **Admin** | Full dashboard, user management, price updates, content management |

## Key Design Decisions

- **Mobile-first**: All layouts designed for 375px screens first
- **Offline-capable**: Training videos and encyclopedia cached via service worker
- **Bilingual**: i18n with `en` and `sw` (Swahili) locales throughout
- **Low-bandwidth**: Compressed images, lazy loading, minimal JS bundles

# Danawa Auto Sales Radar

## Overview

A Korean automotive sales analytics dashboard that tracks and displays "surge" models from Danawa's vehicle sales data. The application identifies domestic and imported vehicle models showing significant month-over-month sales increases, ranking changes, and growth rates. It serves as a radar tool for spotting trending vehicles in the Korean auto market.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Build Tool**: Vite with React plugin

The frontend follows a component-based architecture with pages in `client/src/pages/` and reusable components in `client/src/components/`. The UI supports light/dark theme switching stored in localStorage.

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful JSON endpoints under `/api/`

Key endpoints:
- `GET /api/radar/:month/:nation` - Fetches radar model data for a specific month and nation (domestic/import)

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Drizzle Kit (`drizzle-kit push`)

Database tables:
- `users` - Basic user authentication (id, username, password)
- `radar_models` - Vehicle sales metrics (sales, prev_sales, mom_abs, mom_pct, ranks, score, danawa_url)

Currently uses mock data generation in `server/storage.ts` with realistic Korean domestic and import brand/model data.

### Scoring Algorithm
Models are ranked by a composite "surge score" combining:
- Month-over-month absolute change (sales - prev_sales)
- Month-over-month percentage change
- Rank change from previous month
- Minimum sales threshold filter (default 300 units)

### Monorepo Structure
```
client/          # React frontend
server/          # Express backend
shared/          # Shared TypeScript types and Drizzle schema
migrations/      # Database migrations
```

Path aliases configured:
- `@/*` → `./client/src/*`
- `@shared/*` → `./shared/*`

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **connect-pg-simple**: Session storage for PostgreSQL

### UI/Styling
- **Radix UI**: Accessible component primitives (dialog, dropdown, tabs, etc.)
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management

### Data Handling
- **Zod**: Runtime schema validation
- **drizzle-zod**: Zod schema generation from Drizzle schemas
- **date-fns**: Date manipulation utilities

### Build/Dev
- **Vite**: Development server and production bundler
- **esbuild**: Server-side bundling for production
- **tsx**: TypeScript execution for development

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal`: Error overlay in development
- `@replit/vite-plugin-cartographer`: Development tooling
- `@replit/vite-plugin-dev-banner`: Development banner

## Netlify Deployment

This project is configured for Netlify deployment with serverless functions.

### Configuration Files
- `netlify.toml` - Build settings and redirects
- `netlify/functions/radar.ts` - Serverless function for API
- `client/public/_redirects` - SPA routing fallback

### Deployment Steps
1. Connect your GitHub repository to Netlify
2. Netlify will automatically detect the configuration from `netlify.toml`
3. Build command: `npx vite build --config vite.config.ts`
4. Publish directory: `dist/public`
5. Functions directory: `netlify/functions`

### API Redirect
The `/api/radar/:month/:nation` endpoint is redirected to the Netlify serverless function at `/.netlify/functions/radar` with query parameters.
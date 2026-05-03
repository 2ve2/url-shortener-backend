# 🔗 URL Shortener Backend

A fast, type-safe URL shortener API built with **Bun**, **Hono**, **Drizzle ORM**, and **PostgreSQL** (Neon).

## ✨ Features

- **Shorten URLs** — Generate unique short codes with [cuid2](https://github.com/paralleldrive/cuid2)
- **Redirect** — Clean short URLs (`example.com/abc123`) with automatic click tracking
- **Statistics** — Track click counts per shortened URL
- **Security** — Security headers middleware (CSP, HSTS, X-Frame-Options, etc.)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | [Bun](https://bun.sh) |
| Framework | [Hono](https://hono.dev) |
| Database | [PostgreSQL](https://neon.tech) (Neon Serverless) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) |
| Validation | [Zod](https://zod.dev) |
| IDs | [cuid2](https://github.com/paralleldrive/cuid2) |

## 📦 Project Structure

```
src/
├── index.ts                    # App entry point
├── config/
│   └── env.ts                  # Environment variable validation (Zod)
├── db/
│   ├── index.ts                # Database connection (Neon + Drizzle)
│   ├── schema/
│   │   └── shortener.ts        # Shortener table schema
│   └── migrations/             # Drizzle migration files
├── lib/
│   └── response-helpers.ts     # Standardized API response helpers
├── middleware/
│   └── security-headers.ts     # Security headers middleware
└── routes/
    ├── shortener.ts            # API routes (/api/shorten, /api/stats)
    └── redirect.ts             # Redirect route (/:shortCode)
```

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/docs/installation) v1.0+
- A [Neon](https://neon.tech) PostgreSQL database (or any PostgreSQL instance)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/url-shortener-backend.git
cd url-shortener-backend

# Install dependencies
bun install
```

### Environment Setup

```bash
# Copy the example env file
cp .env.example .env

# Edit with your database URL
```

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
```

### Database Setup

```bash
# Push schema to database (development)
bun run db:push

# Or generate and run migrations (production)
bun run db:generate
bun run db:migrate
```

### Run

```bash
# Development (with hot reload)
bun run dev

# Production
bun run start
```

## 📡 API Endpoints

### `GET /`

Health check endpoint.

**Response:**
```json
{
  "status": true,
  "message": "API is running",
  "result": {
    "timestamp": "2026-05-02T21:00:00.000Z"
  }
}
```

---

### `POST /api/shorten`

Create a shortened URL.

**Request Body:**
```json
{
  "url": "https://example.com/very/long/url"
}
```

**Response (201):**
```json
{
  "status": true,
  "message": "URL shortened successfully",
  "result": {
    "shortened": {
      "id": "clx1abc2e0001...",
      "originalUrl": "https://example.com/very/long/url",
      "shortCode": "abc12",
      "clicks": 0,
      "createdAt": "2026-05-02T21:00:00.000Z"
    }
  }
}
```

**Error (400):**
```json
{
  "status": false,
  "error": "Invalid URL provided"
}
```

---

### `GET /:shortCode`

Redirect to the original URL. Increments the click counter.

**Example:** `GET /abc12` → redirects to `https://example.com/very/long/url`

**Error (404):**
```json
{
  "status": false,
  "error": "Short URL not found"
}
```

---

### `GET /api/stats/:shortCode`

Get statistics for a shortened URL.

**Response (200):**
```json
{
  "status": true,
  "message": "Statistics retrieved successfully",
  "result": {
    "stats": {
      "id": "clx1abc2e0001...",
      "originalUrl": "https://example.com/very/long/url",
      "shortCode": "abc12",
      "clicks": 42,
      "createdAt": "2026-05-02T21:00:00.000Z"
    }
  }
}
```

**Error (404):**
```json
{
  "status": false,
  "error": "Short URL not found"
}
```

## 🗄️ Database Schema

```sql
CREATE TABLE shortener (
  id           TEXT PRIMARY KEY,
  original_url TEXT NOT NULL,
  shortener_url TEXT NOT NULL UNIQUE,
  clicks       INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with hot reload |
| `bun run start` | Start production server |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Run pending migrations |
| `bun run db:push` | Push schema directly to database |
| `bun run db:studio` | Open Drizzle Studio (DB GUI) |

## 📄 License

MIT

# Quran Application - Backend API

Backend API server for the Quran application built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- 🔐 **OAuth2 Token Management**: Secure authentication with Quran Foundation API
- 📖 **Verse of the Day**: Random verse with 24-hour caching
- 💭 **Reflections CRUD**: Save and retrieve user reflections on verses
- 🔍 **Search**: Proxy search to Quran API with query logging
- 💾 **PostgreSQL Database**: Persistent storage with Sequelize ORM
- ⚡ **Caching**: Optimized performance with node-cache
- 🎯 **TypeScript**: Type-safe development

## Prerequisites

- Node.js >= 18.x
- PostgreSQL database (using Neon)
- npm or yarn

## Installation

```bash
cd server
npm install
```

## Environment Variables

Create a `.env` file in the server directory:

```env
DATABASE_URL=your_postgresql_connection_string
QURAN_CLIENT_ID=your_client_id
QURAN_CLIENT_SECRET=your_client_secret
QURAN_TOKEN_URL=https://api.quran.com/api/v4/oauth/token
QURAN_API_BASE_URL=https://api.quran.com/api/v4
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Database Setup

Synchronize database models:

```bash
npm run db:sync
```

## Development

Start the development server:

```bash
npm run dev
```

## Production

Build and start:

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `GET /api/token` - Get OAuth2 access token

### Verses
- `GET /api/verse-of-day` - Get verse of the day (24h cache)

### Reflections
- `POST /api/reflections` - Create a new reflection
- `GET /api/reflections/:key` - Get reflections for a verse
- `GET /api/reflections/user/:userId` - Get user's reflections

### Search
- `POST /api/search` - Search verses (logs query)
- `GET /api/search/history/:userId` - Get user's search history

## Database Schema

### Reflections Table
- `id`: Primary key
- `user_id`: User identifier
- `verse_key`: Verse reference (e.g., "2:255")
- `reflection_text`: User's reflection
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Search History Table
- `id`: Primary key
- `user_id`: User identifier
- `search_query`: Search text
- `created_at`: Timestamp

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Caching**: node-cache
- **HTTP Client**: Axios

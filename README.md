# Quran Application

A full-stack web application for exploring the Quran with daily verses, personal reflections, and verse search capabilities. Built with Next.js, Node.js, Express, PostgreSQL, and TypeScript.

## 🌟 Features

### Backend (Node.js/Express)
- ✅ **OAuth2 Token Management**: Secure authentication with Quran.Foundation API
- ✅ **Verse of the Day API**: Random verse with 24-hour caching for sustainability
- ✅ **Reflections CRUD**: Custom database operations for user reflections
- ✅ **Search API**: Proxy to Quran.Foundation with query logging
- ✅ **PostgreSQL Database**: Persistent storage with Sequelize ORM
- ✅ **Caching Layer**: Optimized performance with node-cache
- ✅ **TypeScript**: Type-safe development
- ✅ **Error Handling**: Comprehensive error management

### Frontend (Next.js/React)
- ✅ **Verse of the Day Component**: Beautiful display of daily verses
- ✅ **Reflection Modal**: Add and view personal reflections
- ✅ **Search Component**: Search verses with history tracking
- ✅ **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- ✅ **Data Fetching**: SWR for optimized caching and revalidation
- ✅ **TypeScript**: Full type safety
- ✅ **Loading States**: Proper UX with loading indicators

## 📁 Project Structure

```
quran/
├── server/               # Backend API (Node.js/Express)
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── models/      # Sequelize models
│   │   ├── services/    # Business logic
│   │   ├── controllers/ # Route handlers
│   │   ├── routes/      # API routes
│   │   └── index.ts     # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── client/              # Frontend (Next.js/React)
│   ├── src/
│   │   ├── app/        # Next.js pages
│   │   ├── components/ # React components
│   │   ├── lib/        # API client
│   │   ├── types/      # TypeScript types
│   │   └── styles/     # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local
│
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- npm or yarn
- PostgreSQL database (provided)

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with database credentials
# (Already created with your credentials)

# Sync database models
npm run db:sync

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔧 API Endpoints

### Authentication
- `GET /api/token` - Get OAuth2 access token (with caching)

### Verses
- `GET /api/verse-of-day` - Get verse of the day (24h cache)

### Reflections
- `POST /api/reflections` - Create a new reflection
  ```json
  {
    "user_id": "string",
    "verse_key": "string",
    "reflection_text": "string"
  }
  ```
- `GET /api/reflections/:key` - Get reflections for a verse
- `GET /api/reflections/user/:userId` - Get user's reflections

### Search
- `POST /api/search` - Search verses and log query
  ```json
  {
    "query": "string",
    "user_id": "string",
    "page": 1
  }
  ```
- `GET /api/search/history/:userId?limit=20` - Get search history

## 💾 Database Schema

### Reflections Table
| Field            | Type      | Description                |
|------------------|-----------|----------------------------|
| id               | INTEGER   | Primary key                |
| user_id          | STRING    | User identifier            |
| verse_key        | STRING    | Verse reference (e.g., 2:255) |
| reflection_text  | TEXT      | User's reflection          |
| created_at       | TIMESTAMP | Creation timestamp         |
| updated_at       | TIMESTAMP | Update timestamp           |

### Search History Table
| Field         | Type      | Description            |
|---------------|-----------|------------------------|
| id            | INTEGER   | Primary key            |
| user_id       | STRING    | User identifier        |
| search_query  | TEXT      | Search text            |
| created_at    | TIMESTAMP | Creation timestamp     |

## 🎯 Key Implementation Highlights

### ✅ Token Caching
The `/api/token` endpoint manages OAuth2 tokens with automatic caching:
- Tokens are cached for 55 minutes (expires at 60 minutes)
- Automatic refresh when expired
- Reduces API calls to Quran.Foundation

### ✅ Data Caching
The `/api/verse-of-day` endpoint caches verses for 24 hours:
- Reduces external API calls
- Improves sustainability
- Faster response times

### ✅ Custom API Layer
All endpoints are custom-built with:
- Proper error handling
- Request validation
- Response formatting
- Database integration

### ✅ Database Integration
Using Sequelize ORM with PostgreSQL:
- Type-safe models
- Automatic migrations
- Connection pooling
- SSL support for Neon

### ✅ Code Structure
Clear separation of concerns:
- Config: Database and environment
- Models: Data structure
- Services: Business logic
- Controllers: Request handling
- Routes: API endpoints

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://...
QURAN_CLIENT_ID=a773511c-1f1e-407c-8d0f-1bb086bf8441
QURAN_CLIENT_SECRET=DF1D2iADGh.gGGuHx-N8_gMI67
QURAN_TOKEN_URL=https://api.quran.com/api/v4/oauth/token
QURAN_API_BASE_URL=https://api.quran.com/api/v4
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_USER_ID=default-user
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Sequelize
- **Caching**: node-cache
- **HTTP Client**: Axios

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR
- **HTTP Client**: Axios

## 📝 Development Commands

### Backend
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
npm run db:sync  # Synchronize database models
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🌐 Deployment

### Backend
1. Set environment variables on your hosting platform
2. Run `npm run build`
3. Run `npm run db:sync` to setup database
4. Start with `npm start`

### Frontend
1. Set `NEXT_PUBLIC_API_URL` to your backend URL
2. Run `npm run build`
3. Deploy the `.next` folder
4. Or use `npm start` for Node.js hosting

## 📚 Additional Information

- **API Documentation**: See individual README files in `server/` and `client/`
- **Database Credentials**: Already configured in `.env` files
- **API Credentials**: Pre-configured for Quran.Foundation API

## 🤝 Contributing

This is a portfolio/demonstration project. Feel free to fork and modify for your own use.

## 📄 License

MIT

## 👨‍💻 Author

Built as a full-stack demonstration project showcasing:
- RESTful API design
- Database integration
- OAuth2 authentication
- Caching strategies
- TypeScript best practices
- Modern React patterns
- Responsive UI design

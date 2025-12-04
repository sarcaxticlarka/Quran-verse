# Quran Application - Frontend

Frontend application for the Quran project built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- 📖 **Verse of the Day**: Display random Quranic verses with Arabic text and translations
- 💭 **Reflections**: Add and view personal reflections on verses
- 🔍 **Search**: Search through Quranic verses with history tracking
- 🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS
- ⚡ **Optimized Performance**: SWR for data fetching and caching
- 🌐 **TypeScript**: Full type safety

## Prerequisites

- Node.js >= 18.x
- npm or yarn
- Backend API running (see server folder)

## Installation

```bash
cd client
npm install
```

## Environment Variables

Create a `.env.local` file in the client directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_USER_ID=default-user
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Production

Build and start:

```bash
npm run build
npm start
```

## Project Structure

```
client/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   │   ├── VerseOfDay.tsx
│   │   ├── ReflectionModal.tsx
│   │   └── SearchComponent.tsx
│   ├── lib/              # Utility functions
│   │   └── api.ts        # API client
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── styles/           # Global styles
│       └── globals.css
├── public/               # Static assets
└── package.json
```

## Features Detail

### Verse of the Day Component
- Fetches a random verse daily
- Displays Arabic text with Uthmani script
- Shows English translation
- Allows adding reflections
- Cached for 24 hours

### Reflection Modal
- Add personal reflections on verses
- View all previous reflections for a verse
- Real-time updates using SWR
- Formatted timestamps

### Search Component
- Search Quranic verses
- View search history
- Click history items to re-search
- Real-time result display

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR
- **HTTP Client**: Axios
- **Fonts**: Google Fonts (Inter, Amiri for Arabic)

## API Integration

The frontend communicates with the backend API at:
- `GET /api/verse-of-day` - Verse of the day
- `POST /api/reflections` - Create reflection
- `GET /api/reflections/:key` - Get reflections
- `POST /api/search` - Search verses
- `GET /api/search/history/:userId` - Get search history

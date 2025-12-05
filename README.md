# 📖 Quran Application

A beautiful, modern web application for exploring the Quran with daily verses, advanced search, personal reflections, and an Islamic-inspired user interface.

---

## 🎯 Overview

**Quran Application** is a full-stack web application built with modern technologies that provides users with an engaging platform to:
- Discover daily Quranic verses
- Search verses by keywords, phrases, or verse references
- Save personal reflections on verses
- Experience beautiful Arabic typography and Islamic-inspired design
- Access translations in multiple languages

---

## ✨ Key Features

### 🏠 Home Page
- **Verse of the Day**: Randomly displays a daily verse with:
  - Beautiful Arabic text in Uthmani font
  - English translation
  - Verse reference (Surah & Ayah)
  - Option to add personal reflections
  
- **Quick Navigation**:
  - Search Quran - Find verses by keywords or references
  - My Reflections - View saved personal reflections
  
- **Islamic Design Theme**:
  - Green and gold color palette inspired by Islamic culture
  - Crescent moon and mosque icons as decorative elements
  - Responsive design for mobile and desktop

### 🔍 Advanced Search
- **Multiple Search Modes**:
  - Search by keywords (e.g., "mercy", "prayer", "patience")
  - Search by verse reference (e.g., "2:255" for Ayat al-Kursi)
  - Real-time search results with pagination
  
- **Features**:
  - Beautiful result cards with Arabic text and translations
  - Responsive grid layout
  - Error handling and loading states
  - Helpful tips for first-time users

### 💭 Personal Reflections
- **Add Reflections**: Write and save personal thoughts on any verse
- **View Reflections**: See all your previous reflections for a verse
- **User Authentication**: Secure login with Google OAuth
- **Formatted Timestamps**: Track when you added each reflection
- **Real-time Updates**: Reflections sync instantly

### 🎨 Beautiful UI/UX
- **Islamic-Inspired Theme**:
  - Primary green color (#6fa44a) - representing nature and life
  - Gold accents (#ffd700) - symbolizing spirituality
  - Purple accents (#a78bfa) - for elegant highlights
  
- **Modern Components**:
  - Lucide React icons for clean, professional look
  - Smooth transitions and hover effects
  - Properly sized and colored buttons with icons
  - Card-based layouts with shadows and borders

- **Responsive Design**:
  - Mobile-first approach
  - Adapts seamlessly to all screen sizes
  - Touch-friendly buttons and inputs

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Islamic color palette
- **Icons**: Lucide React
- **Data Fetching**: SWR (stale-while-revalidate)
- **HTTP Client**: Axios
- **Authentication**: NextAuth v5
- **Fonts**: Google Fonts (Amiri for Arabic, Inter for English)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Node-Cache for performance optimization
- **Authentication**: JWT tokens with OAuth2 integration
- **External API**: Quran.com API v4

### Database
- **ORM**: Prisma
- **Models**:
  - Users - User profiles and authentication
  - Reflections - Personal verse reflections
  - SearchHistory - User search queries
  - VersePositions - Cached verse data

---

## 📁 Project Structure

```
quran/
├── client/                          # Frontend (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          # Root layout with Islamic motifs
│   │   │   ├── page.tsx            # Home page
│   │   │   ├── search/page.tsx     # Search page
│   │   │   └── reflections/page.tsx # Reflections page
│   │   ├── components/
│   │   │   ├── VerseOfDay.tsx      # Daily verse component
│   │   │   ├── ReflectionModal.tsx # Reflection editor
│   │   │   ├── GoogleSignInButton.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   └── ...other components
│   │   ├── lib/
│   │   │   ├── api.ts              # API client methods
│   │   │   └── auth.ts             # Authentication utilities
│   │   ├── styles/
│   │   │   └── globals.css         # Global styles with Islamic colors
│   │   └── types/
│   │       └── index.ts            # TypeScript interfaces
│   ├── tailwind.config.js          # Tailwind config with custom colors
│   ├── tsconfig.json
│   └── package.json
│
├── server/                          # Backend (Node.js/Express)
│   ├── src/
│   │   ├── index.ts                # Server entry point
│   │   ├── config/
│   │   │   ├── database.ts         # Database configuration
│   │   │   └── prisma.ts           # Prisma configuration
│   │   ├── controllers/
│   │   │   ├── reflectionController.ts
│   │   │   ├── searchController.ts
│   │   │   ├── verseController.ts
│   │   │   └── ...other controllers
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Reflection.ts
│   │   │   └── SearchHistory.ts
│   │   ├── routes/
│   │   │   └── index.ts            # API route definitions
│   │   ├── services/
│   │   │   ├── quranApiService.ts  # Quran.com API integration
│   │   │   ├── cacheService.ts     # Caching logic
│   │   │   └── tokenService.ts
│   │   └── scripts/
│   │       └── syncDb.ts           # Database sync script
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   └── migrations/
│   ├── tsconfig.json
│   └── package.json
│
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database
- Google OAuth credentials (for authentication)
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sarcaxticlarka/quran.git
   cd quran
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Configure environment variables
   cp .env.example .env
   
   # Setup database
   npm run db:sync
   npm run build
   npm run start
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   
   # Configure environment variables
   cp .env.example .env.local
   
   # Start development server
   npm run dev
   ```
 
---

## 📚 API Endpoints

### Verses
- `GET /api/verse-of-day` - Get daily verse
- `GET /api/verses/:verse_key` - Get specific verse
- `GET /api/verses/search?query=...` - Search verses

### Reflections
- `GET /api/reflections/:verse_key` - Get reflections for a verse
- `POST /api/reflections` - Create new reflection
- `DELETE /api/reflections/:id` - Delete reflection

### Search
- `POST /api/search` - Advanced search with filters
- `GET /api/search-history` - Get user's search history

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - User logout

---

## 🎨 Design Features

### Color Palette
- **Primary Green**: `#6fa44a` - Nature, life, spirituality
- **Gold Accent**: `#ffd700` - Celestial, nobility
- **Purple Accent**: `#a78bfa` - Elegance, wisdom
- **Neutral**: Gray shades for text and backgrounds

### Islamic Design Elements
- Crescent moon icon in header
- Mosque icon for spiritual significance
- Geometric SVG patterns
- Arabic typography (Amiri font)
- Bismillah (﷽) symbol on home page
- Border-left accents on cards mimicking Islamic tilework

### User Experience
- Smooth animations and transitions
- Loading states with spinners
- Error messages with helpful guidance
- Mobile-responsive layouts
- Accessibility-first design
- Dark mode compatible

---

## 🔐 Security Features

- **OAuth2 Authentication** with Google Sign-in
- **JWT Token Management** for secure API access
- **CORS Protection** - Restricted to frontend URL
- **SQL Injection Prevention** - Prisma ORM sanitizes queries
- **XSS Protection** - React's built-in sanitization
 
---

## 📊 Data Caching Strategy

The application implements a two-tier caching strategy for performance:

1. **Token Cache** (5 minutes)
   - Stores OAuth tokens to reduce authentication calls

2. **Data Cache** (24 hours for verses, 7 days for translations)
   - Caches frequently accessed Quranic data
   - Reduces external API calls
   - Improves page load times

---

## 🧪 Testing

### Manual Testing Checklist

**Home Page**
- [ ] Verse of the day displays on page load
- [ ] Arabic text renders correctly
- [ ] Translation displays below Arabic text
- [ ] "Add Reflection" button opens modal

**Search**
- [ ] Search form accepts input
- [ ] Results display in cards
- [ ] Pagination works correctly
- [ ] Help text shows for new users

**Reflections**
- [ ] Login required to save reflection
- [ ] Reflection text saves successfully
- [ ] Previous reflections display with timestamps
- [ ] Multiple reflections per verse work

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy to Vercel
```

### Backend (Railway/Render/Heroku)
```bash
cd server
npm run build
# Deploy with PostgreSQL database
```

---

## 📖 Features Overview

| Feature | Status | Description |
|---------|--------|-------------|
| Verse of the Day | ✅ Complete | Random daily verse with translation |
| Advanced Search | ✅ Complete | Search by keywords or references |
| Personal Reflections | ✅ Complete | Save and view personal thoughts |
| Google Authentication | ✅ Complete | Secure OAuth login |
| Islamic UI Theme | ✅ Complete | Beautiful, culturally-inspired design |
| Mobile Responsive | ✅ Complete | Works on all screen sizes |
| Search History | ✅ Complete | Track user searches |
| Arabic Typography | ✅ Complete | Proper Uthmani font rendering |
| Caching | ✅ Complete | Performance optimization |
| Error Handling | ✅ Complete | User-friendly error messages |

---
 
 
 

---

## 🌟 Version History

### v1.0.0 (Current)
- ✅ Core features implemented
- ✅ Islamic-inspired UI theme
- ✅ Advanced search functionality
- ✅ Personal reflections system
- ✅ Google authentication
- ✅ Performance optimization with caching

---

**Built with ❤️ for the Quran and its seekers**

*"Indeed, those who have believed and done righteous deeds will have gardens beneath which rivers flow."* - Quran 2:25

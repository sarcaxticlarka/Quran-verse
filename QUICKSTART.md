# 🚀 Quick Start Guide

## ✅ Prerequisites Check
- ✅ Node.js installed
- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed
- ✅ Database tables created

## 🎯 Starting the Application

### Option 1: Using Shell Scripts (Recommended)

Open **two terminal windows**:

**Terminal 1 - Start Backend:**
```bash
cd /Users/underxcore/Desktop/quran
./start-backend.sh
```

**Terminal 2 - Start Frontend:**
```bash
cd /Users/underxcore/Desktop/quran
./start-frontend.sh
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd /Users/underxcore/Desktop/quran/server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /Users/underxcore/Desktop/quran/client
npm run dev
```

## 🌐 Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 📋 Testing the Features

### 1. Verse of the Day
- Visit http://localhost:3000
- You should see a random Quranic verse displayed
- The verse includes Arabic text and English translation
- Click "Add Reflection" to save your thoughts

### 2. Reflections
- Click "Add Reflection" on any verse
- Type your reflection in the modal
- Click "Save Reflection"
- View all previous reflections below the form

### 3. Search
- Scroll down to the "Search Quran" section
- Enter keywords like "paradise", "mercy", or "faith"
- Click "Search" to find relevant verses
- Click "Show History" to see your past searches

## 🔍 API Testing with cURL

### Get Verse of the Day
```bash
curl http://localhost:5000/api/verse-of-day
```

### Get OAuth Token
```bash
curl http://localhost:5000/api/token
```

### Create a Reflection
```bash
curl -X POST http://localhost:5000/api/reflections \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user",
    "verse_key": "2:255",
    "reflection_text": "This verse reminds me of Allah's infinite knowledge."
  }'
```

### Get Reflections for a Verse
```bash
curl http://localhost:5000/api/reflections/2:255
```

### Search Verses
```bash
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "paradise",
    "user_id": "test-user"
  }'
```

### Get Search History
```bash
curl http://localhost:5000/api/search/history/test-user
```

## 🛠️ Troubleshooting

### Backend won't start
```bash
cd server
npm install
npm run db:sync
npm run dev
```

### Frontend won't start
```bash
cd client
npm install
npm run dev
```

### Database connection error
Check that your `.env` file in the `server` directory has the correct DATABASE_URL.

### Port already in use
If port 5000 or 3000 is already in use:
- Change PORT in `server/.env`
- Change NEXT_PUBLIC_API_URL in `client/.env.local`

## 📊 Project Checklist

- ✅ **Token Caching**: OAuth2 token is cached for 55 minutes
- ✅ **Data Caching**: Verse of the day is cached for 24 hours
- ✅ **Custom API Layer**: All REST endpoints implemented
- ✅ **Database Integration**: PostgreSQL with Sequelize ORM
- ✅ **Error Handling**: Comprehensive error messages
- ✅ **TypeScript**: Full type safety in both frontend and backend
- ✅ **Code Structure**: Clear separation of concerns

## 🎓 Learning Points

### Backend Highlights
1. **OAuth2 Implementation**: Secure token management with caching
2. **Caching Strategy**: Two-tier caching (tokens and data)
3. **Database Design**: Normalized schema with indexes
4. **API Design**: RESTful endpoints with proper HTTP methods
5. **Error Handling**: Graceful degradation and user-friendly messages

### Frontend Highlights
1. **Component Architecture**: Reusable, focused components
2. **State Management**: SWR for server state
3. **User Experience**: Loading states, error handling, optimistic updates
4. **Responsive Design**: Mobile-first approach
5. **Type Safety**: TypeScript interfaces for API responses

## 📝 Next Steps

1. **Customize the UI**: Modify Tailwind classes in components
2. **Add Authentication**: Implement real user authentication
3. **Add More Features**: Bookmarks, favorites, daily reminders
4. **Deploy**: Deploy to Vercel (frontend) and Railway/Render (backend)
5. **Testing**: Add unit tests and integration tests

## 🤝 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure both servers are running
4. Check database connection

Enjoy exploring the Quran! 🌟

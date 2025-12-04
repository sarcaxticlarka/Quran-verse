#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Quran Application Setup Script              ║${NC}"
echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d "server" ] || [ ! -d "client" ]; then
    echo -e "${YELLOW}⚠️  Please run this script from the quran project root directory${NC}"
    exit 1
fi

# Setup Backend
echo -e "${GREEN}📦 Setting up Backend...${NC}"
cd server

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "✓ Backend dependencies already installed"
fi

echo -e "${GREEN}🗄️  Syncing Database...${NC}"
npm run db:sync

cd ..

# Setup Frontend
echo -e "${GREEN}📦 Setting up Frontend...${NC}"
cd client

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "✓ Frontend dependencies already installed"
fi

cd ..

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo -e "${BLUE}To start the application:${NC}"
echo -e "  1. Start the backend:  ${YELLOW}cd server && npm run dev${NC}"
echo -e "  2. Start the frontend: ${YELLOW}cd client && npm run dev${NC}"
echo ""
echo -e "${BLUE}Or use the start scripts:${NC}"
echo -e "  ${YELLOW}./start-backend.sh${NC}  - Start backend on port 5000"
echo -e "  ${YELLOW}./start-frontend.sh${NC} - Start frontend on port 3000"
echo ""

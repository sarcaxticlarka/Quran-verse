#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting Backend Server...${NC}"
echo -e "${BLUE}Backend will run on http://localhost:5000${NC}"
echo -e "${BLUE}API endpoints at http://localhost:5000/api${NC}"
echo ""

cd server
npm run dev

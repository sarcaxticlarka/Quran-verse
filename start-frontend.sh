#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting Frontend Server...${NC}"
echo -e "${BLUE}Frontend will run on http://localhost:3000${NC}"
echo ""

cd client
npm run dev

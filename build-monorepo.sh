#!/bin/bash

echo "🚀 Building DII Assessment Platform Monorepo"
echo "==========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install --workspaces --if-present --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Step 2: Build packages first (if they have build scripts)
echo -e "${YELLOW}🏗️  Building packages...${NC}"
npm run build --workspaces --if-present || true

# Step 3: Build assessment-light
echo -e "${YELLOW}🎯 Building assessment-light...${NC}"
cd apps/assessment-light
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to build assessment-light${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"

# Step 4: Show build output
echo -e "${YELLOW}📁 Build output:${NC}"
ls -la dist/

cd ../..
echo -e "${GREEN}🎉 Monorepo build complete!${NC}"
#!/usr/bin/env bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🔒 Safe Git Push Workflow${NC}"
echo "=========================="
echo ""

echo "🔄 Fetching latest changes from remote..."
git fetch origin

echo "📊 Comparing local vs remote branch..."
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse @{u})
BASE=$(git merge-base HEAD @{u})

if [ $LOCAL = $REMOTE ]; then
    echo -e "${GREEN}✅ Already up to date, nothing to push.${NC}"
    exit 0
elif [ $LOCAL = $BASE ]; then
    echo -e "${YELLOW}⚠️  Local branch is behind remote. Pulling latest changes...${NC}"
    git pull --rebase origin main
elif [ $REMOTE != $BASE ]; then
    echo -e "${RED}❌ Diverged from remote. Please rebase manually first.${NC}"
    echo "   Run: git pull --rebase origin main"
    exit 1
fi

echo ""
echo "📋 Commits that will be pushed:"
git log --oneline --color origin/main..HEAD
echo ""

read -p "Proceed with push? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${YELLOW}❌ Push cancelled.${NC}"
    exit 0
fi

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo -e "${GREEN}✅ Push completed successfully!${NC}"
echo ""
echo "🔗 Open repository: https://github.com/tianzesun/IntegrityDesk"
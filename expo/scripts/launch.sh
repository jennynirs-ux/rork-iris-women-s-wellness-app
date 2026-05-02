#!/usr/bin/env bash
# IRIS launch helper.
#
# Run after filling in the real Apple IDs in eas.json.
# Validates everything, then offers to trigger the iOS preview build.
#
# Usage:
#   ./scripts/launch.sh

set -euo pipefail

cd "$(dirname "$0")/.."

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()    { echo -e "  ${GREEN}✓${NC} $1"; }
fail()  { echo -e "  ${RED}✗${NC} $1"; exit 1; }
warn()  { echo -e "  ${YELLOW}!${NC} $1"; }
step()  { echo -e "\n${YELLOW}== $1 ==${NC}"; }

step "1. Verify eas.json has real IDs (not placeholders)"
if grep -q "REPLACE_WITH" eas.json; then
  fail "eas.json still contains REPLACE_WITH_* placeholders. Fill them in."
fi
if grep -q "6762470683" eas.json; then
  fail "eas.json contains WFJ's ascAppId (6762470683). Use IRIS's ID."
fi
ok "eas.json IDs look real"

step "2. Verify backend is up"
HTTP=$(curl -sS -m 10 -o /dev/null -w "%{http_code}" https://iris-backend.fly.dev/ || echo "000")
if [ "$HTTP" != "200" ]; then
  fail "iris-backend.fly.dev returned HTTP $HTTP. Wake it: flyctl machine start --app iris-backend"
fi
ok "backend healthy (HTTP 200)"

step "3. Verify env wired"
if ! grep -q "iris-backend.fly.dev" .env 2>/dev/null; then
  warn ".env doesn't reference iris-backend.fly.dev — local dev may use offline mode"
fi
if ! grep -q "iris-backend.fly.dev" eas.json; then
  fail "eas.json missing EXPO_PUBLIC_RORK_API_BASE_URL — production builds will use offline mode"
fi
ok "env points at deployed backend"

step "4. TypeScript compile (excluding tests)"
if ! /Users/jennynirs/.bun/bin/bunx tsc --noEmit --skipLibCheck 2>&1 | grep -v "__tests__/smoke" | grep -q "error"; then
  ok "no TS errors in production paths"
else
  /Users/jennynirs/.bun/bin/bunx tsc --noEmit --skipLibCheck 2>&1 | grep -v "__tests__/smoke" | grep "error" | head -10
  fail "TS errors above — fix before building"
fi

step "5. Icon spec"
SIZE=$(sips -g pixelWidth -g pixelHeight assets/images/icon.png | awk '/pixel/{print $2}' | tr '\n' 'x' | sed 's/x$//')
ALPHA=$(sips -g hasAlpha assets/images/icon.png | awk '/hasAlpha/{print $2}')
if [ "$SIZE" = "1024x1024" ] && [ "$ALPHA" = "no" ]; then
  ok "icon.png is 1024x1024 RGB no alpha"
else
  fail "icon.png is $SIZE alpha=$ALPHA — Apple needs 1024x1024 RGB no alpha"
fi

step "6. EAS authenticated"
if ! /Users/jennynirs/.bun/bin/bunx eas-cli whoami > /dev/null 2>&1; then
  fail "Not logged into EAS. Run: bunx eas-cli login"
fi
ok "EAS logged in"

step "7. All checks passed"
echo
echo "Next: trigger the preview build:"
echo "    bunx eas-cli build --platform ios --profile preview"
echo
echo "When the build finishes (~25 min), it'll appear in App Store Connect"
echo "→ TestFlight → iOS automatically. Install on your device, smoke test,"
echo "then submit:"
echo "    bunx eas-cli submit --platform ios --latest"
echo

read -p "Trigger the preview build now? [y/N] " -r
if [[ $REPLY =~ ^[Yy]$ ]]; then
  /Users/jennynirs/.bun/bin/bunx eas-cli build --platform ios --profile preview
fi

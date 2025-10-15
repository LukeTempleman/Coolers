# ✅ Mock Setup Complete - Testing Guide

## 🎉 Your Mock System is Ready!

**Development Server:** Running on http://localhost:3001  
**Mock Mode:** ✅ Enabled (`NEXT_PUBLIC_USE_MOCK_AUTH=true`)

---

## 🧪 Step-by-Step Testing

### 1️⃣ Test Authentication

**Login Page:** http://localhost:3001/login

Try these accounts:

| Email | Password | Role | Expected Redirect |
|-------|----------|------|-------------------|
| `admin@test.com` | `admin123` | Admin | `/admin/coolers` |
| `user@test.com` | `user123` | User | `/users/dashboard` |
| `demo@test.com` | `demo123` | User | `/users/dashboard` |

**What to verify:**
- [ ] Login form appears
- [ ] Can sign in with test credentials
- [ ] Redirects to correct dashboard based on role
- [ ] Console shows "🔧 Using mock authentication"

---

### 2️⃣ Test Cooler List

**Admin Coolers Page:** http://localhost:3001/admin/coolers (after login)

**What to verify:**
- [ ] Page displays 50 coolers
- [ ] Cooler cards show name, status, location
- [ ] Coolers have different statuses (Active, Maintenance, Idle, Alert, Decommissioned)
- [ ] Locations span Canadian cities (Toronto, Montreal, Vancouver, etc.)
- [ ] Console shows "🔧 Using mock coolers data"
- [ ] Can click on a cooler to view details

**Test Filters:**
- [ ] Filter by status (dropdown)
- [ ] Search by cooler name
- [ ] Filter by location/city
- [ ] Counts update correctly

---

### 3️⃣ Test Cooler Details

Click any cooler from the list

**What to verify:**
- [ ] Cooler detail page loads
- [ ] Shows complete information (name, status, location, temperature, humidity)
- [ ] GPS coordinates displayed
- [ ] Location history visible
- [ ] Photo placeholders load
- [ ] Last service date shown
- [ ] Geofence radius displayed

---

### 4️⃣ Test Interactive Maps

**Geofencing Page:** http://localhost:3001/coolers/geofencing

**⚠️ Requires Mapbox Token:**
If map doesn't load, add to `.env.local`:
```bash
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
```
Get free token: https://account.mapbox.com/access-tokens/

**What to verify:**
- [ ] Map loads with Mapbox tiles
- [ ] 50 cooler markers appear across Canada
- [ ] Markers are color-coded by status
- [ ] Click marker shows cooler popup with details
- [ ] Geofence circles (radius) visible around coolers
- [ ] Can zoom/pan across the map
- [ ] KPI cards show correct statistics
- [ ] Polygon drawing tools available

**Test Map Features:**
- [ ] Zoom in to Toronto area - see multiple coolers
- [ ] Click on a cooler marker - popup shows name and status
- [ ] Use polygon tool to draw a custom zone
- [ ] Check that coolers in different cities show correct coordinates

---

### 5️⃣ Test Status Counts & KPIs

**Dashboard/Admin Page**

**What to verify:**
- [ ] KPI cards show status counts
- [ ] Total coolers = 50
- [ ] Status breakdown matches filter results
- [ ] Active, Maintenance, Idle, Alert, Decommissioned counts display
- [ ] Percentages calculate correctly

---

### 6️⃣ Test Data Consistency

**Check Console Logs:**
Open browser DevTools (F12) → Console

**Expected messages:**
```
🔧 Using mock authentication
🔧 Using mock coolers data
🔧 Using mock cooler status counts
🔧 Mock mode: Simulating cooler update for ID: mock-cooler-001
```

**Check Network Tab:**
Open DevTools → Network

**Expected API calls:**
- `GET /api/coolers` → Returns 50 coolers
- `GET /api/coolers/mock-cooler-001` → Returns single cooler
- `GET /api/coolers/status-counts` → Returns status aggregation

---

## 🗺️ Map Testing Checklist

### Without Mapbox Token
- [ ] Page loads without crashing
- [ ] Cooler data still loads
- [ ] Map container shows placeholder or error
- [ ] KPIs and stats still work

### With Mapbox Token
- [ ] Map tiles load correctly
- [ ] All 50 coolers show as markers
- [ ] Markers cluster when zoomed out
- [ ] Individual markers visible when zoomed in
- [ ] Correct positioning across Canada:
  - [ ] Toronto area (-79.38, 43.65)
  - [ ] Montreal area (-73.57, 45.50)
  - [ ] Vancouver area (-123.12, 49.28)
  - [ ] Calgary area (-114.07, 51.04)

---

## 📊 Expected Mock Data

### Cooler Distribution
- **50 Coolers** total
- **15 Cities** across Canada
- **5 Status Types** (varied distribution)
- **4 Models** (Standard, Premium, Ultra, Compact)

### Sample Coolers to Look For
- `Cooler-001` - Toronto, Ontario
- `Cooler-002` - Montreal, Quebec
- `Cooler-003` - Vancouver, British Columbia
- `Cooler-004` - Calgary, Alberta
- `Cooler-050` - Victoria, British Columbia

### Data Ranges
- Temperature: -5°C to 15°C
- Humidity: 30% to 70%
- Radius: 200m to 500m
- Created: Within last 90 days

---

## 🐛 Common Issues & Fixes

### ❌ "No coolers found"
**Fix:**
```bash
# Check .env.local has:
NEXT_PUBLIC_USE_MOCK_AUTH=true

# Restart dev server:
# Stop: Ctrl+C
npm run dev
```

### ❌ Login fails / "Invalid credentials"
**Fix:**
- Double-check email/password exactly as listed
- Clear browser cookies
- Try incognito/private window
- Verify `NEXT_PUBLIC_USE_MOCK_AUTH=true`

### ❌ Map is blank/not loading
**Fix:**
```bash
# Add to .env.local:
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_actual_token

# Get free token at:
# https://account.mapbox.com/access-tokens/

# Restart dev server
```

### ❌ Console errors about "@/lib/mockCoolers"
**Fix:**
```bash
# File should exist at:
# /app/lib/mockCoolers.ts

# If missing, check:
ls app/lib/mockCoolers.ts

# Restart TypeScript server in VS Code:
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### ❌ Port 3000 already in use
**Note:** This is normal! Server automatically uses port 3001
- Use: http://localhost:3001

---

## ✅ Success Criteria

Your mock system is working correctly if:

✅ Can log in with test accounts  
✅ See 50 coolers in the list  
✅ Console shows "🔧 Using mock..." messages  
✅ Can view individual cooler details  
✅ Maps load (with Mapbox token)  
✅ Coolers appear on map with correct locations  
✅ Filters work (status, search, location)  
✅ KPIs show correct counts  
✅ No TypeScript errors  
✅ No console errors (except missing Mapbox token warning)  

---

## 🚀 Quick Test Commands

```bash
# Start dev server
npm run dev

# Check for TypeScript errors
npm run build

# Run linting
npm run lint
```

---

## 📝 Test Results Template

Copy and fill out:

```
MOCK SYSTEM TEST RESULTS
========================

Date: ___________
Tester: ___________

✅/❌ Authentication works
✅/❌ 50 coolers display
✅/❌ Cooler details load
✅/❌ Maps display (with token)
✅/❌ Filters work correctly
✅/❌ KPIs show accurate data
✅/❌ Console logs show mock mode
✅/❌ No TypeScript errors
✅/❌ No console errors

Issues Found:
_________________________________
_________________________________

Notes:
_________________________________
_________________________________
```

---

## 🎯 Next Steps After Testing

Once everything works:

1. **Add Mapbox Token** (if not done)
2. **Customize Mock Data** (see `MOCK_COOLERS_README.md`)
3. **Build Real Features** on top of mock data
4. **Switch to Real Backend** when ready (change env var)

---

## 📚 Documentation Reference

- **Quick Start:** `QUICK_START.md`
- **Mock Auth Details:** `MOCK_AUTH_README.md`
- **Mock Coolers Details:** `MOCK_COOLERS_README.md`
- **Original README:** `README.md`

---

**Happy Testing!** 🎉

If everything passes, you have a fully functional mock cooler tracking system!

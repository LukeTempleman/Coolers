# Mock Coolers & Maps Setup

## 🎉 Overview

Your project now has **50 fully-functional mock coolers** with real GPS coordinates across Canada! No backend database required.

## 📍 Mock Cooler Data

### What's Included

- **50 Coolers** distributed across 15 major Canadian cities
- **Real GPS Coordinates** for accurate map visualization
- **Complete Location Info**: City, Province, Country
- **Various Statuses**: Active, Maintenance, Idle, Alert, Decommissioned
- **Different Models**: Standard, Premium, Ultra, Compact
- **Sensor Data**: Temperature (-5°C to 15°C) and Humidity (30-70%)
- **Location History**: 3 historical positions per cooler
- **Geofence Radius**: 200-500 meters per cooler
- **Timestamps**: Creation dates, last service, last notifications

### Cities Covered

Toronto (ON), Montreal (QC), Vancouver (BC), Calgary (AB), Ottawa (ON), Edmonton (AB), Mississauga (ON), Winnipeg (MB), Quebec City (QC), Hamilton (ON), Brampton (ON), Surrey (BC), Kitchener (ON), London (ON), Victoria (BC)

## 🗺️ Interactive Maps

The geofencing page (`/coolers/geofencing`) displays all coolers on an interactive Mapbox map with:

- **Cooler Markers** showing exact locations
- **Status Indicators** color-coded by cooler status
- **Geofence Circles** showing the radius around each cooler
- **Click Interactions** to view cooler details
- **Polygon Drawing** for custom geofence zones
- **Real-time Updates** (in mock mode, simulated)

### Setting Up Maps

1. Get a free Mapbox token: https://account.mapbox.com/access-tokens/
2. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_token_here
   ```
3. Restart dev server

## 🔌 API Endpoints (Mocked)

All these endpoints work in mock mode (`NEXT_PUBLIC_USE_MOCK_AUTH=true`):

### GET /api/coolers
Get list of coolers with optional filters:
- `?status=Active` - Filter by status
- `?search=Cooler-001` - Search by name
- `?city=Toronto` - Filter by city
- `?province=Ontario` - Filter by province

**Returns**: Array of cooler objects

### GET /api/coolers/[id]
Get individual cooler details

**Returns**: Single cooler object with full details

### GET /api/coolers/status-counts
Get aggregated status counts

**Returns**: 
```json
{
  "statusCounts": {
    "Active": 25,
    "Maintenance": 10,
    "Idle": 8,
    "Alert": 5,
    "Decommissioned": 2
  },
  "total": 50
}
```

### POST /api/coolers
Create a new cooler (simulated in mock mode)

### PUT /api/coolers/[id]
Update a cooler (simulated in mock mode)

### DELETE /api/coolers/[id]
Delete a cooler (simulated in mock mode)

## 📊 Data Structure

Each mock cooler has this structure:

```typescript
{
  _id: "mock-cooler-001",
  name: "Cooler-001",
  company: "mock-company-1",
  location: {
    type: "Point",
    coordinates: [-79.3832, 43.6532], // [longitude, latitude]
    city: "Toronto",
    province: "Ontario",
    country: "Canada"
  },
  photoUrls: ["https://picsum.photos/seed/cooler1/400/300"],
  coolerModel: "Standard",
  humidity: 45,
  lastServiceDate: "2024-11-15T10:30:00.000Z",
  temperature: 5,
  status: "Active",
  radius: 300,
  isActive: true,
  locationHistory: [
    {
      coordinates: [-79.3832, 43.6532],
      timestamp: "2024-08-01T10:00:00.000Z"
    }
  ],
  createdAt: "2024-08-01T10:00:00.000Z",
  updatedAt: "2024-10-15T14:22:00.000Z"
}
```

## 🎨 Customizing Mock Data

### Add More Coolers

Edit `/app/lib/mockCoolers.ts`:

```typescript
// Change the number from 50 to however many you want
export const mockCoolers: Cooler[] = Array.from({ length: 100 }, (_, i) => 
  generateMockCooler(i)
);
```

### Add More Cities

Add to the `cities` array in `/app/lib/mockCoolers.ts`:

```typescript
const cities = [
  // ... existing cities
  { 
    name: "Halifax", 
    province: "Nova Scotia", 
    country: "Canada", 
    coords: [-63.5752, 44.6488] 
  },
];
```

### Customize Cooler Properties

Modify the `generateMockCooler` function in `/app/lib/mockCoolers.ts`:

```typescript
function generateMockCooler(index: number): Cooler {
  // Change temperature range
  temperature: Math.floor(Math.random() * 30) - 10, // -10 to 20°C
  
  // Change radius range
  radius: 500 + Math.floor(Math.random() * 500), // 500-1000 meters
  
  // Add custom naming
  name: `MyBrand-${String(index + 1).padStart(3, '0')}`,
}
```

## 🔄 Switching Between Mock and Real Data

### Mock Mode (Current)
```bash
NEXT_PUBLIC_USE_MOCK_AUTH=true
```
- Uses local mock data
- No backend required
- 50 pre-generated coolers
- Instant responses

### Real Mode
```bash
NEXT_PUBLIC_USE_MOCK_AUTH=false
```
- Connects to backend API
- Requires backend server running on port 3001
- Real database data
- Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001`

## 🧪 Testing the Maps

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Log in** with test account:
   - Email: `admin@test.com`
   - Password: `admin123`

3. **Navigate to geofencing:**
   - Go to `/coolers/geofencing`
   - Or click "Geofencing" in the sidebar

4. **Interact with the map:**
   - Pan and zoom to explore coolers across Canada
   - Click on cooler markers to see details
   - Use the polygon tool to draw custom zones
   - Toggle between different views

## 📈 Features Working in Mock Mode

✅ **Authentication** - Sign in with test users  
✅ **Cooler List** - View all 50 coolers  
✅ **Cooler Details** - Click any cooler for full info  
✅ **Filters** - Filter by status, search, location  
✅ **Maps** - Interactive Mapbox with all coolers  
✅ **Geofencing** - View radius zones on map  
✅ **Status Counts** - Dashboard KPIs and aggregations  
✅ **Create/Update/Delete** - Simulated operations  

## 🚫 Limitations in Mock Mode

- Changes don't persist (resets on refresh)
- Real-time updates are simulated
- No actual GPS tracking
- Notifications are mocked
- User actions don't sync across tabs

## 🔧 Troubleshooting

**Coolers not showing up?**
```bash
# Check your .env.local has:
NEXT_PUBLIC_USE_MOCK_AUTH=true

# Restart dev server
npm run dev
```

**Map is blank?**
```bash
# Add a valid Mapbox token to .env.local:
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_actual_token

# Get one free at: https://account.mapbox.com/
```

**Console errors about coordinates?**
- Check that coordinates are in [longitude, latitude] format
- Longitude is first (X axis), Latitude is second (Y axis)

**Cooler positions look wrong?**
- Mock data uses real Canadian city coordinates
- Each cooler has a small random offset for variety
- You can adjust the offset in `generateMockCooler()`

## 🎯 Next Steps

Ready to connect to a real backend? See `MOCK_AUTH_README.md` for instructions on switching to real mode.

---

**Enjoy your fully-functional mock cooler tracking system!** 🎉

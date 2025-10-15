# 🚀 Quick Start Guide - Mock Mode

Your project is now configured for **complete mock mode**! No database or backend API connection needed.

## ✅ You're Ready to Go!

Your `.env.local` file is already configured with:
```bash
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

This enables:
- ✅ Mock authentication (3 test users)
- ✅ Mock cooler data (50 coolers across Canada)
- ✅ Mock geofencing & maps with real coordinates
- ✅ Mock API endpoints for all cooler operations

## 🔐 Test Accounts

### Admin Account
```
Email:    admin@test.com
Password: admin123
```
→ Redirects to: `/admin/coolers` (view all coolers, manage system)

### User Accounts
```
Email:    user@test.com
Password: user123
```
→ Redirects to: `/users/dashboard`

```
Email:    demo@test.com
Password: demo123
```
→ Redirects to: `/users/dashboard`

## 🗺️ Mock Data Included

- **50 Mock Coolers** across major Canadian cities (Toronto, Montreal, Vancouver, Calgary, etc.)
- **Real GPS Coordinates** for accurate map display
- **Various Statuses**: Active, Maintenance, Idle, Alert, Decommissioned
- **Location History** for each cooler
- **Temperature & Humidity** data
- **Geofencing** with radius zones

## 🎯 How to Test

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Open the login page:**
   ```
   http://localhost:3000/login
   ```

3. **Sign in** with any of the test accounts above

4. **You'll be automatically redirected** based on your role!

5. **Explore Features:**
   - View cooler list at `/admin/coolers` or dashboard
   - Click on any cooler to see details
   - Visit `/coolers/geofencing` to see the interactive map
   - Filter coolers by status, location, model

## 🔄 Switch Between Mock and Real Mode

### Currently Active: Mock Mode (No DB) ✓
```bash
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

### To Use Real Backend:
```bash
NEXT_PUBLIC_USE_MOCK_AUTH=false
```
⚠️ Remember to restart your dev server after changing this!

## 📝 What Was Changed

| File | Purpose |
|------|---------|
| `/app/lib/mockUsers.ts` | Mock user authentication database |
| `/app/lib/mockCoolers.ts` | Mock cooler data (50 coolers with GPS) |
| `/app/api/auth/[...nextauth]/route.ts` | Auth logic with mock support |
| `/app/api/coolers/route.ts` | Cooler list & create with mock mode |
| `/app/api/coolers/[id]/route.ts` | Individual cooler CRUD with mock mode |
| `/app/api/coolers/status-counts/route.ts` | Status aggregation with mock mode |
| `.env.local` | Mock mode toggle & Mapbox config |

## 🎨 Adding More Test Users

Edit `/app/lib/mockUsers.ts`:

```typescript
export const mockUsers: MockUser[] = [
  // Add your custom test user here!
  {
    _id: "mock-custom-1",
    email: "yourname@test.com",
    password: "yourpassword",
    name: "Your Name",
    roles: ["user"], // or ["admin"]
    tenantId: "tenant-1",
  },
  // ... existing users
];
```

## �️ Mapbox Setup (Optional but Recommended)

The geofencing map requires a Mapbox token. To enable maps:

1. Get a **free** Mapbox token at: https://account.mapbox.com/access-tokens/
2. Add it to `.env.local`:
   ```bash
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_actual_token_here
   ```
3. Restart your dev server

**Note:** Without a Mapbox token, coolers list will work but maps won't display.

## �🐛 Troubleshooting

**Login not working?**
- Check the email/password match exactly
- Restart dev server after any `.env.local` changes
- Clear browser cookies if needed

**No coolers showing?**
- Verify `NEXT_PUBLIC_USE_MOCK_AUTH=true` in `.env.local`
- Check browser console for "🔧 Using mock coolers data"
- Restart dev server

**Map not loading?**
- Add a valid `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` to `.env.local`
- Get a free token at https://account.mapbox.com/

**TypeScript errors?**
- Run `npm install` to ensure dependencies are installed
- The project is configured and error-free!

**Want to see mock mode logs?**
- Check the browser console and terminal
- Look for "🔧 Using mock..." messages

## 📚 More Info

See `MOCK_AUTH_README.md` for complete documentation.

---

**Ready to sign in?** Start your dev server and go to `/login`! 🎉

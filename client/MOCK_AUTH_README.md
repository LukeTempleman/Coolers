# Mock Authentication Setup

This project now supports **mock authentication mode** for development and testing without connecting to a database.

## Quick Start

### Enable Mock Mode

The mock mode is **already enabled** in your `.env.local` file:

```bash
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

### Test Users

You can sign in with these test accounts:

#### Admin User
- **Email:** `admin@test.com`
- **Password:** `admin123`
- **Role:** Admin
- **Access:** Admin dashboard and all admin features

#### Regular User
- **Email:** `user@test.com`
- **Password:** `user123`
- **Role:** User
- **Access:** User dashboard

#### Demo User
- **Email:** `demo@test.com`
- **Password:** `demo123`
- **Role:** User
- **Access:** User dashboard

### How to Sign In

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login page: `http://localhost:3000/login`

3. Enter one of the test accounts above

4. You'll be redirected to the appropriate dashboard based on your role

## Switching Between Mock and Real Mode

### Use Mock Authentication (No Database)
Set in `.env.local`:
```bash
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

### Use Real Authentication (Requires Backend API)
Set in `.env.local`:
```bash
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

**Note:** When using real mode, make sure your backend API is running on `http://localhost:3001`

## Adding More Mock Users

To add more test users, edit `/app/lib/mockUsers.ts`:

```typescript
export const mockUsers: MockUser[] = [
  // ... existing users
  {
    _id: "mock-user-3",
    email: "newuser@test.com",
    password: "password123",
    name: "New User",
    roles: ["user"],
    tenantId: "tenant-1",
  },
];
```

## Architecture

### Files Modified

1. **`/app/lib/mockUsers.ts`** - Contains mock user data and authentication logic
2. **`/app/api/auth/[...nextauth]/route.ts`** - NextAuth configuration with mock mode support
3. **`.env.local`** - Environment variable for enabling/disabling mock mode

### How It Works

1. When `NEXT_PUBLIC_USE_MOCK_AUTH=true`, the NextAuth credentials provider checks credentials against the mock user list
2. If a match is found, a mock JWT token is generated
3. The session is created with the mock user data
4. Middleware handles routing based on user roles (admin/user)

## Troubleshooting

### "Invalid credentials" error
- Double-check the email and password match one of the test accounts
- Ensure `NEXT_PUBLIC_USE_MOCK_AUTH=true` in your `.env.local`
- Restart your development server after changing environment variables

### Changes not taking effect
- Restart your development server
- Clear your browser cookies/session storage
- Check the browser console for authentication logs

### TypeScript errors
- Run `npm install` to ensure all dependencies are installed
- The `@/lib/*` path alias points to `/app/lib/*`

## Security Note

⚠️ **Mock mode is for development only!** Never use this in production. The mock users have plain-text passwords and no real security. Always set `NEXT_PUBLIC_USE_MOCK_AUTH=false` for production deployments.

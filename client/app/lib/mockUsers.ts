// Mock user data for testing without database connection
export interface MockUser {
  _id: string;
  email: string;
  password: string; // In real app, this would be hashed
  name: string;
  roles: string[];
  tenantId?: string;
}

export const mockUsers: MockUser[] = [
  {
    _id: "mock-admin-1",
    email: "admin@test.com",
    password: "admin123",
    name: "Admin User",
    roles: ["admin"],
    tenantId: "tenant-1",
  },
  {
    _id: "mock-user-1",
    email: "user@test.com",
    password: "user123",
    name: "Test User",
    roles: ["user"],
    tenantId: "tenant-1",
  },
  {
    _id: "mock-user-2",
    email: "demo@test.com",
    password: "demo123",
    name: "Demo User",
    roles: ["user"],
    tenantId: "tenant-2",
  },
];

export const findMockUser = (email: string, password: string): MockUser | null => {
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );
  return user || null;
};

export const generateMockToken = (userId: string): string => {
  // Generate a simple mock token
  return `mock-token-${userId}-${Date.now()}`;
};

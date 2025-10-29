// Mock cooler data for testing without database connection
import { Cooler } from "../lib/schemas";
import { CoolerStatusEnum, CoolerModelEnum } from "../lib/constants";

// Major South African cities with realistic coordinates [lng, lat]
const cities = [
  { name: "Johannesburg", province: "Gauteng", country: "South Africa", coords: [28.0473, -26.2041] },
  { name: "Pretoria", province: "Gauteng", country: "South Africa", coords: [28.1881, -25.7479] },
  { name: "Cape Town", province: "Western Cape", country: "South Africa", coords: [18.4241, -33.9249] },
  { name: "Durban", province: "KwaZulu-Natal", country: "South Africa", coords: [31.0218, -29.8587] },
  { name: "Port Elizabeth", province: "Eastern Cape", country: "South Africa", coords: [25.6022, -33.9608] },
  { name: "Bloemfontein", province: "Free State", country: "South Africa", coords: [26.2023, -29.0852] },
  { name: "Polokwane", province: "Limpopo", country: "South Africa", coords: [29.4487, -23.9045] },
  { name: "Nelspruit", province: "Mpumalanga", country: "South Africa", coords: [30.9702, -25.4753] },
  { name: "Kimberley", province: "Northern Cape", country: "South Africa", coords: [24.7631, -28.7282] },
  { name: "Mahikeng", province: "North West", country: "South Africa", coords: [25.6447, -25.8601] },
  { name: "Pietermaritzburg", province: "KwaZulu-Natal", country: "South Africa", coords: [30.3753, -29.6009] },
  { name: "East London", province: "Eastern Cape", country: "South Africa", coords: [27.9116, -33.0153] },
  { name: "Stellenbosch", province: "Western Cape", country: "South Africa", coords: [18.8667, -33.9321] },
  { name: "Sandton", province: "Gauteng", country: "South Africa", coords: [28.0436, -26.1076] },
  { name: "Soweto", province: "Gauteng", country: "South Africa", coords: [27.8546, -26.2678] },
];

const models = Object.values(CoolerModelEnum);

// Sample customer names and companies
const customerNames = [
  "John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", "David Wilson",
  "Jessica Garcia", "Robert Martinez", "Lisa Anderson", "Christopher Taylor", "Amanda Thomas",
  "Matthew Jackson", "Ashley White", "Daniel Harris", "Jennifer Martin", "James Thompson",
  "Michelle Garcia", "William Rodriguez", "Nicole Lewis", "Richard Lee", "Stephanie Walker"
];

const companies = [
  "FreshMart", "QuickStop", "City Grocery", "Corner Deli", "Prime Foods",
  "Local Market", "Valley Store", "Metro Foods", "Sunrise Mart", "Golden Gate Grocery",
  "Rainbow Foods", "Eastside Market", "Westend Store", "Downtown Deli", "Neighborhood Mart"
];

// Helper to generate random contract data
function generateMockContract(index: number) {
  const customerName = customerNames[index % customerNames.length];
  const companyName = companies[index % companies.length];
  const contractStartDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
  const contractEndDate = new Date(contractStartDate.getFullYear() + 1, contractStartDate.getMonth(), contractStartDate.getDate());
  const lastPaymentDate = new Date(contractStartDate.getTime() + Math.random() * (Date.now() - contractStartDate.getTime()));
  const nextPaymentDate = new Date(lastPaymentDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days after last payment
  
  return {
    contractNumber: `CON-${String(index + 1).padStart(6, '0')}`,
    customerName: customerName,
    customerEmail: `${customerName.toLowerCase().replace(' ', '.')}@${companyName.toLowerCase().replace(' ', '')}.co.za`,
    customerPhone: `+27 ${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
    contractStartDate: contractStartDate.toISOString(),
    contractEndDate: contractEndDate.toISOString(),
    monthlyFee: Math.floor(Math.random() * 500) + 200, // R200-R700 per month
    depositAmount: Math.floor(Math.random() * 1000) + 500, // R500-R1500 deposit
    contractStatus: ['Active', 'Pending', 'Expired'][Math.floor(Math.random() * 3)] as 'Active' | 'Pending' | 'Expired',
    serviceLevel: ['Basic', 'Standard', 'Premium'][Math.floor(Math.random() * 3)] as 'Basic' | 'Standard' | 'Premium',
    billingAddress: {
      street: `${Math.floor(Math.random() * 999) + 1} ${['Main', 'Church', 'Market', 'High', 'Commercial'][Math.floor(Math.random() * 5)]} Street`,
      city: cities[index % cities.length].name,
      province: cities[index % cities.length].province,
      postalCode: String(Math.floor(Math.random() * 9000) + 1000),
      country: "South Africa",
    },
    paymentMethod: ['Credit Card', 'Bank Transfer', 'Debit Order'][Math.floor(Math.random() * 3)] as 'Credit Card' | 'Bank Transfer' | 'Debit Order',
    lastPaymentDate: lastPaymentDate.toISOString(),
    nextPaymentDate: nextPaymentDate.toISOString(),
  };
}

// Generate 120 random indices for Alert status coolers (unassigned)
const alertIndices = new Set<number>();
while (alertIndices.size < 70) {
  alertIndices.add(Math.floor(Math.random() * 200));
}

// Generate 40 random indices for Assigned status coolers (assigned but not activated)
const assignedIndices = new Set<number>();
while (assignedIndices.size < 40) {
  const index = Math.floor(Math.random() * 200);
  if (!alertIndices.has(index)) {
    assignedIndices.add(index);
  }
}

// Generate 10 random indices for Maintenance status coolers (need maintenance)
const maintenanceIndices = new Set<number>();
while (maintenanceIndices.size < 10) {
  const index = Math.floor(Math.random() * 200);
  if (!alertIndices.has(index) && !assignedIndices.has(index)) {
    maintenanceIndices.add(index);
  }
}

// Helper to generate random cooler data
function generateMockCooler(index: number): Cooler {
  const city = cities[index % cities.length];
  // Add some random offset to coordinates for variety (±0.05 degrees)
  const lngOffset = (Math.random() - 0.5) * 0.1;
  const latOffset = (Math.random() - 0.5) * 0.1;
  
  // 120 coolers have Alert status (unassigned), rest are Active
    // Set status based on index
    const status = alertIndices.has(index) 
      ? CoolerStatusEnum.Alert 
      : assignedIndices.has(index)
      ? CoolerStatusEnum.Assigned
      : maintenanceIndices.has(index)
      ? CoolerStatusEnum.Maintenance
      : CoolerStatusEnum.Active;
  const model = models[index % models.length];
  
  const now = new Date();
  const createdDate = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000); // Random within last 90 days
  const lastServiceDate = new Date(createdDate.getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000); // Random service date after creation
  
  return {
    _id: `SN-${String(index + 1).padStart(6, '0')}`,
    name: `Cooler-${String(index + 1).padStart(3, '0')}`,
    company: "mock-company-1", // Default company for tenant-1
    location: {
      type: "Point" as const,
      coordinates: [
        city.coords[0] + lngOffset,
        city.coords[1] + latOffset
      ] as [number, number],
      city: city.name,
      province: city.province,
      country: city.country,
    },
    photoUrls: [
      `https://picsum.photos/seed/cooler${index}/400/300`,
      `https://picsum.photos/seed/cooler${index}a/400/300`,
    ],
    coolerModel: model,
    humidity: Math.floor(Math.random() * 40) + 30, // 30-70%
    lastServiceDate: lastServiceDate.toISOString(),
    temperature: Math.floor(Math.random() * 20) - 5, // -5 to 15°C
    status: status,
    radius: 200 + Math.floor(Math.random() * 300), // 200-500 meters
    isActive: true, // All coolers are active (either Active or Alert status)
    lastNotification: status === CoolerStatusEnum.Alert ? new Date(now.getTime() - Math.random() * 2 * 60 * 60 * 1000).toISOString() : undefined,
    locationHistory: [
      {
        coordinates: [city.coords[0], city.coords[1]] as [number, number],
        timestamp: createdDate.toISOString(),
      },
      {
        coordinates: [city.coords[0] + lngOffset * 0.5, city.coords[1] + latOffset * 0.5] as [number, number],
        timestamp: new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        coordinates: [city.coords[0] + lngOffset, city.coords[1] + latOffset] as [number, number],
        timestamp: now.toISOString(),
      },
    ],
    customerContract: status !== CoolerStatusEnum.Alert ? generateMockContract(index) : undefined, // Only assigned/active coolers have contracts
    createdAt: createdDate.toISOString(),
    updatedAt: now.toISOString(),
  };
}

// Generate 200 mock coolers (120 unassigned with Alert status, 80 Active)
export const mockCoolers: Cooler[] = Array.from({ length: 200 }, (_, i) => generateMockCooler(i));

// Helper functions
export const findMockCoolerById = (id: string): Cooler | undefined => {
  return mockCoolers.find(c => c._id === id);
};

export const filterMockCoolers = (filters: {
  status?: string;
  search?: string;
  city?: string;
  province?: string;
}): Cooler[] => {
  let filtered = [...mockCoolers];
  
  if (filters.status) {
    const statusFilter = filters.status.toLowerCase();
    
    if (statusFilter === 'active') {
      // Show only Active coolers
      filtered = filtered.filter(c => c.status === 'Active');
    } else if (statusFilter === 'inactive') {
      // Show all non-Active coolers (Alert, Maintenance, Idle, Decommissioned)
      filtered = filtered.filter(c => c.status !== 'Active');
    } else if (statusFilter === 'maintenance') {
      // Show only Maintenance coolers
      filtered = filtered.filter(c => c.status === 'Maintenance');
    } else {
      // Direct match for other statuses (case insensitive)
      const targetStatus = statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
      filtered = filtered.filter(c => c.status === targetStatus);
    }
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(searchLower) ||
      c.location.city.toLowerCase().includes(searchLower) ||
      c.location.province.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.city) {
    filtered = filtered.filter(c => c.location.city === filters.city);
  }
  
  if (filters.province) {
    filtered = filtered.filter(c => c.location.province === filters.province);
  }
  
  return filtered;
};

export const getMockCoolerStatusCounts = (filters?: Record<string, string>): {
  statusCounts: Record<string, number>;
  total: number;
} => {
  const filtered = filterMockCoolers(filters || {});
  
  const statusCounts: Record<string, number> = {};
  filtered.forEach(cooler => {
    statusCounts[cooler.status] = (statusCounts[cooler.status] || 0) + 1;
  });
  
  return {
    statusCounts,
    total: filtered.length,
  };
};

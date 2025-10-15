import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../lib/auth';

// Mock merchants data
const mockMerchants = [
  { id: 'merch-1', name: 'Super Market Chain', status: 'active', region: 'Gauteng', coolersCount: 45 },
  { id: 'merch-2', name: 'Corner Store Network', status: 'active', region: 'Western Cape', coolersCount: 23 },
  { id: 'merch-3', name: 'Quick Mart', status: 'active', region: 'KwaZulu-Natal', coolersCount: 31 },
  { id: 'merch-4', name: 'Local Grocery', status: 'active', region: 'Eastern Cape', coolersCount: 18 },
  { id: 'merch-5', name: 'Express Shops', status: 'active', region: 'Free State', coolersCount: 12 },
];

// Check if we're in mock mode - hardcoded to true for demo
const USE_MOCK_DATA = true;

export async function GET(request: NextRequest) {
  try {
    // Temporarily disable authentication for testing
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    
    // Get query parameters for filtering
    const status = searchParams.get('status');

    // Mock mode - return mock merchants
    if (USE_MOCK_DATA) {
      console.log('🔧 Using mock merchants data');
      
      let filteredMerchants = mockMerchants;
      
      if (status && status !== 'all') {
        filteredMerchants = mockMerchants.filter(merchant => merchant.status === status);
      }
      
      return NextResponse.json(filteredMerchants);
    }

    // Build query parameters for the backend
    const queryParams = new URLSearchParams();
    if (status) queryParams.append('status', status);

    // Make request to backend API for merchants list
    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/merchants/list?${queryParams.toString()}`;
    
    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const merchantsList = await response.json();
    return NextResponse.json(merchantsList);

  } catch (error) {
    console.error('Error fetching merchants list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch merchants list' }, 
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { getMockCoolerStatusCounts } from '@/lib/mockCoolers';

// Check if we're in mock mode
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    // Mock mode - return mock status counts
    if (USE_MOCK_DATA) {
      console.log('🔧 Using mock cooler status counts');
      
      const filters: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        filters[key] = value;
      });
      
      const statusCounts = getMockCoolerStatusCounts(filters);
      return NextResponse.json(statusCounts);
    }

    // Real API mode
    const merchant = searchParams.get('merchant');
    const location = searchParams.get('location');
    const coolerModel = searchParams.get('coolerModel');
    const coordinates = searchParams.get('coordinates');

    const queryParams = new URLSearchParams();
    if (merchant) queryParams.append('merchant', merchant);
    if (location) queryParams.append('location', location);
    if (coolerModel) queryParams.append('coolerModel', coolerModel);
    if (coordinates) queryParams.append('coordinates', coordinates);

    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coolers/status-counts?${queryParams.toString()}`;
    
    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const statusCounts = await response.json();
    return NextResponse.json(statusCounts);

  } catch (error) {
    console.error('Error fetching cooler status counts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cooler status counts' }, 
      { status: 500 }
    );
  }
}

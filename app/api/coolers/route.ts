import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { filterMockCoolers } from '@/lib/mockCoolers';

// Check if we're in mock mode - default to true for development
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== "false";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    // Mock mode - return mock coolers
    if (USE_MOCK_DATA) {
      console.log('🔧 Using mock coolers data');
      
      const filters = {
        status: searchParams.get('status') || undefined,
        search: searchParams.get('search') || undefined,
        city: searchParams.get('city') || undefined,
        province: searchParams.get('province') || undefined,
      };
      
      const coolers = filterMockCoolers(filters);
      return NextResponse.json(coolers);
    }

    // Real API mode
    const queryParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      queryParams.append(key, value);
    });

    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coolers?${queryParams.toString()}`;
    
    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const coolers = await response.json();
    return NextResponse.json(coolers);

  } catch (error) {
    console.error('Error fetching coolers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coolers' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock mode - simulate cooler creation
    if (USE_MOCK_DATA) {
      console.log('🔧 Mock mode: Simulating cooler creation');
      const body = await request.json();
      
      const newCooler = {
        _id: `mock-cooler-${Date.now()}`,
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return NextResponse.json(newCooler, { status: 201 });
    }

    // Real API mode
    const body = await request.json();
    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coolers`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const cooler = await response.json();
    return NextResponse.json(cooler, { status: 201 });

  } catch (error) {
    console.error('Error creating cooler:', error);
    return NextResponse.json(
      { error: 'Failed to create cooler' }, 
      { status: 500 }
    );
  }
}
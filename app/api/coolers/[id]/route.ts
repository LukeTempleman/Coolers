import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { findMockCoolerById } from '@/lib/mockCoolers';

// Check if we're in mock mode
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Mock mode - return mock cooler
    if (USE_MOCK_DATA) {
      console.log(`🔧 Using mock cooler data for ID: ${id}`);
      
      const cooler = findMockCoolerById(id);
      
      if (!cooler) {
        return NextResponse.json(
          { error: 'Cooler not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(cooler);
    }

    // Real API mode
    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coolers/${id}`;
    
    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Cooler not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const cooler = await response.json();
    return NextResponse.json(cooler);

  } catch (error) {
    console.error('Error fetching cooler:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cooler' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    // Mock mode - simulate update
    if (USE_MOCK_DATA) {
      console.log(`🔧 Mock mode: Simulating cooler update for ID: ${id}`);
      
      const cooler = findMockCoolerById(id);
      
      if (!cooler) {
        return NextResponse.json(
          { error: 'Cooler not found' },
          { status: 404 }
        );
      }
      
      const updatedCooler = {
        ...cooler,
        ...body,
        _id: id, // Preserve ID
        updatedAt: new Date().toISOString(),
      };
      
      return NextResponse.json(updatedCooler);
    }

    // Real API mode
    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coolers/${id}`;
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Cooler not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const cooler = await response.json();
    return NextResponse.json(cooler);

  } catch (error) {
    console.error('Error updating cooler:', error);
    return NextResponse.json(
      { error: 'Failed to update cooler' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Mock mode - simulate delete
    if (USE_MOCK_DATA) {
      console.log(`🔧 Mock mode: Simulating cooler deletion for ID: ${id}`);
      
      const cooler = findMockCoolerById(id);
      
      if (!cooler) {
        return NextResponse.json(
          { error: 'Cooler not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ message: 'Cooler deleted successfully' });
    }

    // Real API mode
    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coolers/${id}`;
    
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Cooler not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error deleting cooler:', error);
    return NextResponse.json(
      { error: 'Failed to delete cooler' },
      { status: 500 }
    );
  }
}

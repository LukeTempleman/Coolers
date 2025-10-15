import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

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

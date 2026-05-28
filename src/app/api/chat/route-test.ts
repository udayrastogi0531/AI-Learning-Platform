import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Chat API called');
    
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    console.log('API key exists:', !!apiKey);
    console.log('API key starts with AIza:', apiKey?.startsWith('AIza'));
    
    if (!apiKey) {
      console.error('No API key found');
      return NextResponse.json(
        { error: 'Google Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Parse the request body
    const body = await request.json();
    console.log('Request body:', body);
    
    const { message, context } = body;

    if (!message || typeof message !== 'string') {
      console.error('Invalid message:', message);
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Test with a simple response first
    return NextResponse.json({
      response: `Echo: ${message} (This is a test response)`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
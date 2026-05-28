import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🤖 Chat API called');
    
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    console.log('🔑 API key exists:', !!apiKey);
    console.log('🔑 API key format valid:', apiKey?.startsWith('AIza'));
    
    if (!apiKey) {
      console.error('❌ No API key found');
      return NextResponse.json(
        { error: 'Google Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Parse the request body
    const body = await request.json();
    console.log('📝 Request body:', body);
    
    const { message, context } = body;

    if (!message || typeof message !== 'string') {
      console.error('❌ Invalid message:', message);
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Try to import and use the Gemini service
    try {
      console.log('📦 Attempting to import GeminiAIService...');
      const { GeminiAIService } = await import('../../../lib/gemini');
      console.log('✅ GeminiAIService imported successfully');
      
      console.log('🔍 Validating API key format...');
      if (!GeminiAIService.isValidApiKey(apiKey)) {
        console.error('❌ Invalid API key format');
        return NextResponse.json(
          { error: 'Invalid Google Gemini API key format' },
          { status: 500 }
        );
      }
      
      console.log('🚀 Creating Gemini service instance...');
      const geminiService = new GeminiAIService(apiKey);
      
      console.log('💭 Generating AI response...');
      const response = await geminiService.generateResponse(message, context);
      
      console.log('✅ AI response generated successfully');
      return NextResponse.json({
        response,
        timestamp: new Date().toISOString()
      });
      
    } catch (geminiError) {
      console.error('❌ Gemini service error:', geminiError);
      
      // Fall back to echo response if Gemini fails
      console.log('🔄 Falling back to echo response...');
      const errorMessage = geminiError instanceof Error ? geminiError.message : 'Unknown Gemini error';
      return NextResponse.json({
        response: `Echo (Gemini unavailable): ${message}. Error: ${errorMessage}`,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('❌ Chat API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
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
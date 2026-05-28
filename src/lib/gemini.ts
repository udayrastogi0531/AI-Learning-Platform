import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini AI service for handling chat requests
export class GeminiAIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Using Gemini 2.5 Flash (stable, fast, released June 2025)
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });
  }

  /**
   * Generate a response from Gemini AI
   */
  async generateResponse(
    prompt: string,
    context?: {
      userRole?: 'learner' | 'instructor' | 'org_admin' | 'super_admin';
      currentPage?: string;
      previousMessages?: Array<{ role: 'user' | 'assistant'; content: string }>;
    }
  ): Promise<string> {
    try {
      // Create enhanced prompt with context
      const enhancedPrompt = this.buildEnhancedPrompt(prompt, context);
      
      console.log('🔍 Sending request to Gemini API...');
      const result = await this.model.generateContent(enhancedPrompt);
      const response = await result.response;
      const text = response.text();
      console.log('✅ Gemini response received:', text.substring(0, 100));
      return text;
    } catch (error) {
      console.error('❌ Gemini AI Error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw new Error(`Failed to generate AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate streaming response for real-time chat
   */
  async generateStreamingResponse(
    prompt: string,
    context?: {
      userRole?: 'learner' | 'instructor' | 'org_admin' | 'super_admin';
      currentPage?: string;
      previousMessages?: Array<{ role: 'user' | 'assistant'; content: string }>;
    }
  ): Promise<AsyncGenerator<string, void, unknown>> {
    try {
      const enhancedPrompt = this.buildEnhancedPrompt(prompt, context);
      
      const result = await this.model.generateContentStream(enhancedPrompt);
      
      async function* streamGenerator() {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          if (chunkText) {
            yield chunkText;
          }
        }
      }
      
      return streamGenerator();
    } catch (error) {
      console.error('Gemini AI Streaming Error:', error);
      throw new Error('Failed to generate streaming response');
    }
  }

  /**
   * Build enhanced prompt with role-specific context
   */
  private buildEnhancedPrompt(
    prompt: string,
    context?: {
      userRole?: 'learner' | 'instructor' | 'org_admin' | 'super_admin';
      currentPage?: string;
      previousMessages?: Array<{ role: 'user' | 'assistant'; content: string }>;
    }
  ): string {
    let enhancedPrompt = '';

    // Add role-specific system context
    if (context?.userRole) {
      const roleContext = this.getRoleContext(context.userRole);
      enhancedPrompt += `${roleContext}\n\n`;
    }

    // Add page context
    if (context?.currentPage) {
      enhancedPrompt += `Current page: ${context.currentPage}\n\n`;
    }

    // Add conversation history
    if (context?.previousMessages && context.previousMessages.length > 0) {
      enhancedPrompt += 'Previous conversation:\n';
      context.previousMessages.slice(-5).forEach(msg => {
        enhancedPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      enhancedPrompt += '\n';
    }

    // Add the actual user prompt
    enhancedPrompt += `User question: ${prompt}`;

    return enhancedPrompt;
  }

  /**
   * Get role-specific context for better AI responses
   */
  private getRoleContext(role: string): string {
    const contexts = {
      learner: `You are an AI learning assistant helping a student on an educational platform. 
        Focus on:
        - Explaining concepts clearly and simply
        - Providing step-by-step solutions
        - Encouraging learning and curiosity
        - Suggesting related topics to explore
        - Helping with homework and study strategies`,
      
      instructor: `You are an AI teaching assistant helping an instructor/teacher. 
        Focus on:
        - Pedagogical strategies and best practices
        - Course content creation and organization
        - Student engagement techniques
        - Assessment and grading strategies
        - Classroom management tips`,
      
      org_admin: `You are an AI assistant helping an organization administrator. 
        Focus on:
        - User management and organizational strategies
        - Platform usage optimization
        - Analytics interpretation
        - Workflow improvements
        - Team coordination`,
      
      super_admin: `You are an AI assistant helping a platform super administrator. 
        Focus on:
        - System administration and technical support
        - Platform configuration and optimization
        - Security and compliance guidance
        - Advanced analytics and reporting
        - Troubleshooting complex issues`
    };

    return contexts[role as keyof typeof contexts] || contexts.learner;
  }

  /**
   * Validate API key format
   */
  static isValidApiKey(apiKey: string): boolean {
    return !!(apiKey && apiKey.trim().length > 0 && apiKey.startsWith('AIza'));
  }
}

// Export singleton instance for client-side usage
let geminiInstance: GeminiAIService | null = null;

export const getGeminiInstance = (): GeminiAIService => {
  if (!geminiInstance) {
    throw new Error('Gemini AI service not initialized');
  }
  return geminiInstance;
};

export const initializeGemini = (apiKey: string): GeminiAIService => {
  if (!GeminiAIService.isValidApiKey(apiKey)) {
    throw new Error('Invalid Google Gemini API key format');
  }
  
  geminiInstance = new GeminiAIService(apiKey);
  return geminiInstance;
};
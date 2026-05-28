// List all available models for the API key
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

console.log('🔍 Listing Available Models\n');
console.log('='.repeat(80));

if (!apiKey) {
  console.error('❌ No API key found');
  process.exit(1);
}

console.log('✓ API Key:', apiKey.substring(0, 10) + '...\n');

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    // Try to call the list models endpoint directly
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Successfully retrieved models!\n');
    
    if (data.models && data.models.length > 0) {
      console.log(`Found ${data.models.length} available models:\n`);
      
      data.models.forEach((model, index) => {
        console.log(`${index + 1}. ${model.name}`);
        console.log(`   Display Name: ${model.displayName || 'N/A'}`);
        console.log(`   Description: ${model.description || 'N/A'}`);
        console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        console.log('');
      });
      
      // Find the best model to use
      const generateModels = data.models.filter(m => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      if (generateModels.length > 0) {
        console.log('='.repeat(80));
        console.log('\n✨ RECOMMENDED MODEL TO USE:\n');
        const recommended = generateModels[0];
        const modelName = recommended.name.replace('models/', '');
        console.log(`   Model: "${modelName}"`);
        console.log(`   Display Name: ${recommended.displayName}`);
        console.log('\nUpdate your gemini.ts file with this model name! ✅\n');
      }
      
    } else {
      console.log('⚠️  No models found for this API key');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nThis could mean:');
    console.log('- API key is invalid');
    console.log('- Network connection issue');
    console.log('- API endpoint changed\n');
  }
}

listModels();

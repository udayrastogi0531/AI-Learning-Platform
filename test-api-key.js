// Detailed API key validation test
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

console.log('🔍 API Key Diagnostics\n');
console.log('='.repeat(80));

if (!apiKey) {
  console.error('❌ No API key found in .env.local');
  process.exit(1);
}

console.log('✓ API key exists');
console.log('✓ Length:', apiKey.length, 'characters');
console.log('✓ Starts with:', apiKey.substring(0, 10) + '...');
console.log('✓ Format looks valid:', apiKey.startsWith('AIza') ? 'YES' : 'NO');

console.log('\n' + '='.repeat(80));
console.log('\n📡 Testing API Connection...\n');

const genAI = new GoogleGenerativeAI(apiKey);

async function testApiKey() {
  try {
    // Try the latest stable model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('✓ Model instance created');
    
    const result = await model.generateContent('Hello');
    console.log('✓ API request sent');
    
    const response = await result.response;
    console.log('✓ Response received');
    
    const text = response.text();
    console.log('✓ Text extracted:', text.substring(0, 100));
    
    console.log('\n✨ SUCCESS! Your API key is working!\n');
    
  } catch (error) {
    console.log('\n❌ API Request Failed\n');
    console.log('Error details:');
    console.log('- Message:', error.message);
    console.log('- Status:', error.status);
    console.log('- Status Text:', error.statusText);
    
    if (error.status === 404) {
      console.log('\n⚠️  404 Error - Model not found');
      console.log('This usually means:');
      console.log('1. The API key was created for Vertex AI, not Google AI Studio');
      console.log('2. The API key is for an older API version');
      console.log('3. The model name is incorrect for your API version');
    } else if (error.status === 403) {
      console.log('\n⚠️  403 Error - Permission denied');
      console.log('This usually means:');
      console.log('1. API key is invalid or expired');
      console.log('2. API key doesn\'t have proper permissions');
      console.log('3. Generative AI API is not enabled in your project');
    } else if (error.status === 429) {
      console.log('\n⚠️  429 Error - Rate limit exceeded');
      console.log('You\'ve exceeded your quota. Check your usage at:');
      console.log('https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com');
    }
    
    console.log('\n📚 Recommended Actions:');
    console.log('1. Go to https://aistudio.google.com/apikey');
    console.log('2. Create a NEW API key');
    console.log('3. Replace GOOGLE_GEMINI_API_KEY in .env.local');
    console.log('4. Make sure you\'re using Google AI Studio, not Vertex AI');
    console.log('\n');
  }
}

testApiKey();

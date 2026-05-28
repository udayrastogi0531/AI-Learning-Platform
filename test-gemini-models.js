// Test script to check available Gemini models
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ No API key found in .env.local');
  process.exit(1);
}

console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');
console.log('\n📋 Testing different model names...\n');

const genAI = new GoogleGenerativeAI(apiKey);

// List of model names to try
const modelsToTry = [
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-pro-vision',
  'models/gemini-pro',
  'models/gemini-1.5-pro',
  'models/gemini-1.5-flash',
];

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say "Hello" in one word');
    const response = await result.response;
    const text = response.text();
    console.log(`✅ ${modelName.padEnd(30)} - WORKS! Response: ${text.substring(0, 50)}`);
    return true;
  } catch (error) {
    console.log(`❌ ${modelName.padEnd(30)} - ${error.message.split('\n')[0].substring(0, 80)}...`);
    return false;
  }
}

async function testAllModels() {
  console.log('Testing models (this may take a minute)...\n');
  
  let workingModel = null;
  
  for (const modelName of modelsToTry) {
    const works = await testModel(modelName);
    if (works && !workingModel) {
      workingModel = modelName;
    }
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(80));
  if (workingModel) {
    console.log(`\n✨ SUCCESS! Use this model name: "${workingModel}"\n`);
  } else {
    console.log('\n⚠️  No working models found. Your API key might be invalid or have restrictions.\n');
    console.log('Please check:');
    console.log('1. API key is valid in Google AI Studio: https://aistudio.google.com/apikey');
    console.log('2. API key has proper permissions');
    console.log('3. You have available quota\n');
  }
}

testAllModels().catch(console.error);

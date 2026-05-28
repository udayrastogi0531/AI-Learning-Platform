// Test Stripe Payment Integration
// Run: node scripts/test-stripe.js

require('dotenv').config({ path: '.env.local' });

async function testStripe() {
  console.log('\n💳 Testing Stripe Payment Integration...\n');

  // Check if API keys exist
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!publishableKey || !secretKey) {
    console.error('❌ ERROR: Stripe API keys not found in .env.local');
    console.log('\n📋 Setup instructions:');
    console.log('1. Go to https://stripe.com/');
    console.log('2. Create account and enable TEST mode');
    console.log('3. Go to Developers → API keys');
    console.log('4. Copy both keys and add to .env.local:');
    console.log('   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...');
    console.log('   STRIPE_SECRET_KEY=sk_test_...');
    process.exit(1);
  }

  // Verify key formats
  if (!publishableKey.startsWith('pk_test_')) {
    console.error('❌ ERROR: Publishable key should start with "pk_test_" for test mode');
    console.log('💡 Make sure TEST mode is enabled in Stripe Dashboard');
    process.exit(1);
  }

  if (!secretKey.startsWith('sk_test_')) {
    console.error('❌ ERROR: Secret key should start with "sk_test_" for test mode');
    console.log('💡 Make sure TEST mode is enabled in Stripe Dashboard');
    process.exit(1);
  }

  console.log('✅ Publishable Key found');
  console.log(`   Format: ${publishableKey.substring(0, 15)}...`);
  console.log('✅ Secret Key found');
  console.log(`   Format: ${secretKey.substring(0, 15)}...`);

  // Initialize Stripe
  const stripe = require('stripe')(secretKey);

  try {
    // Test 1: List payment methods
    console.log('\n📋 Test 1: Fetching payment methods...');
    const paymentMethods = await stripe.paymentMethods.list({ limit: 3 });
    console.log('✅ Successfully connected to Stripe API');
    console.log(`   Found ${paymentMethods.data.length} payment methods`);

    // Test 2: Create a test product
    console.log('\n📦 Test 2: Creating test product...');
    const product = await stripe.products.create({
      name: 'JavaScript Fundamentals Course (Test)',
      description: 'Complete JavaScript course with certificate - TEST',
      metadata: {
        courseId: 'js-fundamentals',
        testProduct: 'true'
      }
    });
    console.log('✅ Product created successfully');
    console.log(`   Product ID: ${product.id}`);

    // Test 3: Create a test price
    console.log('\n💰 Test 3: Creating test price...');
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2999, // $29.99
      currency: 'usd',
      metadata: {
        testPrice: 'true'
      }
    });
    console.log('✅ Price created successfully');
    console.log(`   Price ID: ${price.id}`);
    console.log(`   Amount: $${(price.unit_amount / 100).toFixed(2)}`);

    // Test 4: Create a test customer
    console.log('\n👤 Test 4: Creating test customer...');
    const customer = await stripe.customers.create({
      email: 'test@example.com',
      name: 'Test User',
      metadata: {
        testCustomer: 'true'
      }
    });
    console.log('✅ Customer created successfully');
    console.log(`   Customer ID: ${customer.id}`);

    // Test 5: Create a payment intent
    console.log('\n💸 Test 5: Creating payment intent...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2999,
      currency: 'usd',
      customer: customer.id,
      metadata: {
        courseId: 'js-fundamentals',
        testPayment: 'true'
      }
    });
    console.log('✅ Payment intent created successfully');
    console.log(`   Payment Intent ID: ${paymentIntent.id}`);
    console.log(`   Status: ${paymentIntent.status}`);

    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...');
    await stripe.prices.update(price.id, { active: false });
    await stripe.products.update(product.id, { active: false });
    console.log('✅ Test data archived');

    // Success summary
    console.log('\n✨ All tests passed! Stripe is ready to use!');
    console.log('\n📊 Summary:');
    console.log('   ✅ API connection working');
    console.log('   ✅ Can create products');
    console.log('   ✅ Can create prices');
    console.log('   ✅ Can create customers');
    console.log('   ✅ Can create payment intents');
    
    console.log('\n🎯 Next steps:');
    console.log('1. Create your actual course products in Stripe Dashboard');
    console.log('2. Set up webhook endpoint for payment confirmations');
    console.log('3. Test with card: 4242 4242 4242 4242');
    console.log('4. Visit: https://dashboard.stripe.com/test/payments');

  } catch (error) {
    console.error('\n❌ ERROR:');
    console.error(error.message);
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('\n💡 Fix: Check your secret key is correct');
      console.log('   Visit: https://dashboard.stripe.com/test/apikeys');
    } else if (error.type === 'StripePermissionError') {
      console.log('\n💡 Fix: API key may not have required permissions');
    }
  }
}

// Run test
testStripe().catch(console.error);

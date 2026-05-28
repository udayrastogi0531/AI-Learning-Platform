// Test SendGrid Email Integration
// Run: node scripts/test-sendgrid.js

require('dotenv').config({ path: '.env.local' });
const sgMail = require('@sendgrid/mail');

async function testSendGrid() {
  console.log('\n🧪 Testing SendGrid Email Integration...\n');

  // Check if API key exists
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.error('❌ ERROR: SENDGRID_API_KEY not found in .env.local');
    console.log('\n📋 Setup instructions:');
    console.log('1. Go to https://sendgrid.com/');
    console.log('2. Create account and verify sender');
    console.log('3. Generate API key');
    console.log('4. Add to .env.local: SENDGRID_API_KEY=SG.your_key_here');
    process.exit(1);
  }

  // Check API key format
  if (!apiKey.startsWith('SG.')) {
    console.error('❌ ERROR: Invalid API key format (should start with "SG.")');
    process.exit(1);
  }

  console.log('✅ API Key found');
  console.log(`   Format: ${apiKey.substring(0, 10)}...`);

  // Initialize SendGrid
  sgMail.setApiKey(apiKey);

  // Prepare test email
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@yourapp.com';
  const testEmail = {
    to: fromEmail, // Send to yourself for testing
    from: fromEmail,
    subject: '🎓 Test Certificate - AI Learning Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">🎉 Congratulations!</h1>
        <p>This is a test email from your AI Learning Platform.</p>
        <p><strong>If you received this email, SendGrid is working correctly!</strong></p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Certificate Details</h2>
          <p><strong>Course:</strong> JavaScript Fundamentals</p>
          <p><strong>Student:</strong> Test User</p>
          <p><strong>Completion Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Credential ID:</strong> TEST-${Date.now()}</p>
        </div>

        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          This is a test email. Your SendGrid integration is working! ✅
        </p>
      </div>
    `,
    text: 'Congratulations! This is a test certificate email. If you received this, SendGrid is working!'
  };

  console.log('\n📧 Sending test email...');
  console.log(`   From: ${fromEmail}`);
  console.log(`   To: ${fromEmail}`);

  try {
    const response = await sgMail.send(testEmail);
    console.log('\n✅ SUCCESS! Email sent successfully!');
    console.log(`   Status Code: ${response[0].statusCode}`);
    console.log(`   Message ID: ${response[0].headers['x-message-id']}`);
    
    console.log('\n📬 Check your inbox!');
    console.log(`   Email sent to: ${fromEmail}`);
    console.log('   (May take 1-2 minutes to arrive)');
    
    console.log('\n✨ SendGrid is ready to use!');
    console.log('   You can now send certificate emails automatically.');
    
  } catch (error) {
    console.error('\n❌ ERROR sending email:');
    console.error(error.response ? error.response.body : error.message);
    
    if (error.code === 401) {
      console.log('\n💡 Fix: Check your API key is correct');
    } else if (error.code === 403) {
      console.log('\n💡 Fix: Verify your sender email in SendGrid dashboard');
    } else {
      console.log('\n💡 Visit: https://app.sendgrid.com/settings/sender_auth');
    }
  }
}

// Run test
testSendGrid().catch(console.error);

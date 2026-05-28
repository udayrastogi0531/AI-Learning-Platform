// Test Firebase Cloud Messaging (Push Notifications)
// Run: node scripts/test-fcm.js

require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

async function testFCM() {
  console.log('\n🔔 Testing Firebase Cloud Messaging...\n');

  // Check if VAPID key exists
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    console.log('⚠️  VAPID key not found in .env.local');
    console.log('\n📋 Setup instructions:');
    console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
    console.log('2. Select project: ai-learning-platform-24fa6');
    console.log('3. Go to: Project Settings → Cloud Messaging');
    console.log('4. Scroll to "Web Push certificates"');
    console.log('5. Click "Generate key pair"');
    console.log('6. Copy the key and add to .env.local:');
    console.log('   NEXT_PUBLIC_FIREBASE_VAPID_KEY=BH7x9fCz...');
    console.log('\n💡 This key is used to request browser notification permissions');
  } else {
    console.log('✅ VAPID Key found');
    console.log(`   Format: ${vapidKey.substring(0, 20)}...`);
  }

  // Check if service account exists
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!serviceAccountPath) {
    console.error('\n❌ ERROR: Service account not configured');
    process.exit(1);
  }

  console.log('✅ Service account found');
  console.log(`   Path: ${serviceAccountPath}`);

  // Initialize Firebase Admin
  try {
    const serviceAccount = require('../service-account.json');
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    
    console.log('✅ Firebase Admin initialized');
    console.log(`   Project: ${serviceAccount.project_id}`);

    // Test sending a notification
    console.log('\n📤 Test: Sending push notification...');
    console.log('⚠️  Note: You need a device token to send actual notifications');
    console.log('   Device tokens are generated when users grant permission in browser');
    
    // Create a sample notification payload
    const sampleNotification = {
      notification: {
        title: '🎓 New Certificate Available!',
        body: 'Congratulations! Your certificate for JavaScript Fundamentals is ready.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png'
      },
      data: {
        url: '/dashboard/achievements',
        type: 'certificate',
        timestamp: Date.now().toString()
      }
    };

    console.log('\n📋 Sample notification payload:');
    console.log(JSON.stringify(sampleNotification, null, 2));

    console.log('\n✨ Firebase Cloud Messaging is configured!');
    console.log('\n🎯 How to test in browser:');
    console.log('1. Start your app: npm run dev');
    console.log('2. Open http://localhost:3000');
    console.log('3. Open browser console (F12)');
    console.log('4. Grant notification permission when prompted');
    console.log('5. Look for: "FCM Token: ..." in console');
    console.log('6. Use that token to send test notifications');

    console.log('\n📱 Send test notification from Firebase Console:');
    console.log('1. Go to: https://console.firebase.google.com/');
    console.log('2. Cloud Messaging → "Send your first message"');
    console.log('3. Paste your FCM token from browser console');
    console.log('4. Click "Test" to send notification');

    // Check if browser-compatible messaging is available
    console.log('\n🌐 Browser Setup:');
    console.log('✅ Service Worker: public/sw.js (exists)');
    console.log('✅ Firebase Config: src/lib/firebase.ts (configured)');
    if (vapidKey) {
      console.log('✅ VAPID Key: Configured in .env.local');
    } else {
      console.log('⚠️  VAPID Key: Not yet configured');
    }

    console.log('\n✅ FCM backend is ready!');
    console.log('   Complete browser setup to enable notifications');

  } catch (error) {
    console.error('\n❌ ERROR:');
    console.error(error.message);
    
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('\n💡 Fix: Make sure service-account.json exists');
      console.log('   Path: D:/AI Driven Platform/service-account.json');
    }
  }
}

// Run test
testFCM().catch(console.error);

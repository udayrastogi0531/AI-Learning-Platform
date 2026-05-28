// Simple test script to check if the chat API is working
const testChatAPI = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, this is a test message',
        context: {
          userRole: 'learner',
          currentPage: '/test',
          previousMessages: []
        }
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data.error);
    } else {
      console.log('✅ API is working! Response:', data.response);
    }
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
};

// Run the test
testChatAPI();
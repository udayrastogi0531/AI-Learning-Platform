'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, MessageCircle, BookOpen, Brain, ArrowRight, Home } from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  action: string;
  completed: boolean;
}

interface ChatMessage {
  id: number;
  type: 'ai' | 'user';
  message: string;
  timestamp: Date;
}

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'ai' as const,
      message: "Hi! I'm your AI learning assistant. I can help you understand complex topics, answer questions, and guide your learning journey. What would you like to learn about today?",
      timestamp: new Date(),
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const demoSteps: DemoStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to AI Learning',
      description: 'Experience personalized learning powered by artificial intelligence',
      action: 'Start Demo',
      completed: false,
    },
    {
      id: 'chat',
      title: 'AI Tutor Chat',
      description: 'Ask questions and get instant, personalized explanations',
      action: 'Try Asking a Question',
      completed: false,
    },
    {
      id: 'adaptive',
      title: 'Adaptive Learning',
      description: 'See how the AI adapts to your learning style and pace',
      action: 'View Learning Path',
      completed: false,
    },
    {
      id: 'progress',
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics',
      action: 'View Progress',
      completed: false,
    },
  ];

  const [steps, setSteps] = useState(demoSteps);

  useEffect(() => {
    // Demo page loaded - could add analytics tracking here if needed
    console.log('Demo page loaded');
  }, []);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const currentInput = userInput;
    setUserInput('');
    setIsTyping(true);

    setChatMessages(prev => {
      const newMessage = {
        id: prev.length + 1,
        type: 'user' as const,
        message: currentInput,
        timestamp: new Date(),
      };
      return [...prev, newMessage];
    });

    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => {
        const aiResponse = {
          id: prev.length + 1,
          type: 'ai' as const,
          message: generateAIResponse(currentInput),
          timestamp: new Date(),
        };
        return [...prev, aiResponse];
      });
      setIsTyping(false);
      
      // Mark chat step as completed
      if (currentStep === 1) {
        completeStep(1);
      }
    }, 1500);

    // Track chat interaction
    console.log('Chat interaction occurred');
  };

  const generateAIResponse = (input: string): string => {
    const responses = [
      "That's a great question! Let me break this down for you step by step. The key concept here involves understanding the fundamental principles...",
      "I can help you with that! Based on your learning style, I recommend starting with the basics and building up gradually...",
      "Excellent topic to explore! Here's how I would approach learning this: First, let's establish the foundation concepts...",
      "This is a common area where students need extra support. Let me provide you with a personalized explanation...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const completeStep = (stepIndex: number) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, completed: true } : step
    ));
    
    if (stepIndex < steps.length - 1) {
      setTimeout(() => setCurrentStep(stepIndex + 1), 1000);
    }
  };

  const handleStepAction = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        setCurrentStep(1);
        completeStep(0);
        break;
      case 1:
        // Focus on chat input
        document.getElementById('chat-input')?.focus();
        break;
      case 2:
        completeStep(2);
        setCurrentStep(3);
        break;
      case 3:
        completeStep(3);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-primary-600 hover:text-primary-500">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Interactive Demo
              </h1>
            </div>
            <Link
              href="/register"
              className="btn-primary"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demo Steps Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Demo Progress
              </h2>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      currentStep === index
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : step.completed
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        step.completed
                          ? 'bg-green-500 text-white'
                          : currentStep === index
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}>
                        {step.completed ? '✓' : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {step.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {step.description}
                        </p>
                        {currentStep === index && !step.completed && (
                          <button
                            onClick={() => handleStepAction(index)}
                            className="mt-2 text-xs bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md transition-colors"
                          >
                            {step.action}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Demo Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Chat Demo */}
            {currentStep >= 1 && (
              <div className="card">
                <div className="flex items-center space-x-2 mb-4">
                  <MessageCircle className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    AI Tutor Chat
                  </h2>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 h-80 overflow-y-auto mb-4">
                  <div className="space-y-4">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.type === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <input
                    id="chat-input"
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about learning..."
                    className="input flex-1"
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isTyping || !userInput.trim()}
                    className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

            {/* Learning Path Demo */}
            {currentStep >= 2 && (
              <div className="card">
                <div className="flex items-center space-x-2 mb-4">
                  <Brain className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Adaptive Learning Path
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {[
                    { title: 'Fundamentals', progress: 100, status: 'completed' },
                    { title: 'Intermediate Concepts', progress: 75, status: 'in-progress' },
                    { title: 'Advanced Topics', progress: 0, status: 'locked' },
                    { title: 'Expert Level', progress: 0, status: 'locked' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        item.status === 'completed' ? 'bg-green-500 text-white' :
                        item.status === 'in-progress' ? 'bg-primary-500 text-white' :
                        'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}>
                        {item.status === 'completed' ? '✓' : index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {item.progress}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Analytics */}
            {currentStep >= 3 && (
              <div className="card">
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Learning Analytics
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</h3>
                    <p className="text-sm text-blue-800 dark:text-blue-300">Lessons Completed</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">8.5h</h3>
                    <p className="text-sm text-green-800 dark:text-green-300">Study Time</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">94%</h3>
                    <p className="text-sm text-purple-800 dark:text-purple-300">Accuracy Rate</p>
                  </div>
                </div>
              </div>
            )}

            {/* Call to Action */}
            {steps.every(step => step.completed) && (
              <div className="card text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Ready to Start Your Learning Journey?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Join thousands of learners who are already transforming their skills with AI-powered education.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register" className="btn-primary">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                  <Link href="/" className="btn-secondary">
                    Learn More
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

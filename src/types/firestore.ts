// Firestore Data Models for AI Learning Platform

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'learner' | 'instructor' | 'org_admin' | 'super_admin';
  
  // Profile details
  headline?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  
  // Learning stats
  stats: {
    totalHoursLearned: number;
    coursesCompleted: number;
    coursesInProgress: number;
    currentStreak: number;
    longestStreak: number;
    totalXP: number;
    level: number;
    mastery: number; // Average mastery across all courses (0-100)
  };
  
  // Preferences
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    autoplay: boolean;
    captionsDefault: boolean;
  };
  
  // Social links
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // Total duration in minutes
  lessonsCount: number;
  
  // Course content
  syllabus: string[];
  learningOutcomes: string[];
  prerequisites: string[];
  
  // Engagement
  enrolled: number;
  rating: number;
  reviewsCount: number;
  
  // Status
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  
  // Video sources (supports multiple formats)
  video: {
    type: 'youtube' | 'vimeo' | 'storage' | 'external';
    url: string;
    duration: number; // Duration in seconds
    thumbnail?: string;
  };
  
  // Resources
  resources?: {
    id: string;
    title: string;
    type: 'pdf' | 'doc' | 'code' | 'link';
    url: string;
  }[];
  
  // Captions & Transcript
  captionsUrl?: string; // .vtt file
  transcript?: string;
  
  // Quiz (optional)
  hasQuiz: boolean;
  quizId?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string; // Format: {uid}_{courseId}
  userId: string;
  courseId: string;
  
  status: 'active' | 'completed' | 'dropped';
  progress: number; // 0-100 percentage
  
  // Tracking
  enrolledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  
  // Certificate
  certificateId?: string;
  certificateIssuedAt?: Date;
}

export interface LessonProgress {
  id: string; // Format: {uid}_{courseId}_{lessonId}
  userId: string;
  courseId: string;
  lessonId: string;
  
  // Video tracking
  watchedSeconds: number;
  totalDuration: number;
  watchPercentage: number; // 0-100
  completed: boolean;
  
  // Resume playback
  lastPosition: number; // Last watched position in seconds
  
  // Timestamps
  startedAt: Date;
  completedAt?: Date;
  lastWatchedAt: Date;
}

export interface CourseProgress {
  id: string; // Format: {uid}_{courseId}
  userId: string;
  courseId: string;
  
  // Overall progress
  overallProgress: number; // 0-100 percentage
  lessonsCompleted: number;
  totalLessons: number;
  
  // Time tracking
  totalTimeSpent: number; // Total minutes spent on course
  lastLessonId?: string;
  lastPosition?: number;
  
  // Mastery
  mastery: number; // 0-100 based on quiz scores and completion
  quizScores: {
    quizId: string;
    score: number;
    attempts: number;
    bestScore: number;
  }[];
  
  updatedAt: Date;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  
  // Certificate details
  credentialId: string; // Unique credential ID for verification
  title: string;
  courseName: string;
  instructor: string;
  
  // Score & Achievement
  finalScore: number;
  completionDate: Date;
  issueDate: Date;
  
  // Skills demonstrated
  skills: string[];
  
  // PDF & Sharing
  pdfUrl?: string; // Cloud Storage URL
  shareUrl?: string; // Public verification URL
  emailSent: boolean;
  
  createdAt: Date;
}

export interface LearningSession {
  id: string;
  userId: string;
  courseId: string;
  lessonId?: string;
  
  // Session tracking
  startTime: Date;
  endTime?: Date;
  duration: number; // Minutes
  
  // Activity type
  activityType: 'video' | 'quiz' | 'reading' | 'practice';
  
  // XP earned
  xpEarned: number;
  
  date: string; // Format: YYYY-MM-DD for daily aggregation
}

export interface Achievement {
  id: string;
  userId: string;
  
  // Achievement details
  type: string; // e.g., 'first_course', 'week_streak', 'speed_learner'
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  
  // Progress
  progress: number;
  requirement: number;
  unlocked: boolean;
  
  unlockedAt?: Date;
  createdAt: Date;
}

export interface Note {
  id: string;
  userId: string;
  courseId: string;
  lessonId?: string;
  
  // Content
  title: string;
  content: string; // Markdown supported
  
  // Organization
  tags: string[];
  pinned: boolean;
  
  // Timestamps
  videoTimestamp?: number; // If note taken during video
  
  createdAt: Date;
  updatedAt: Date;
}

// Firestore collection paths
export const COLLECTIONS = {
  USERS: 'users',
  COURSES: 'courses',
  LESSONS: (courseId: string) => `courses/${courseId}/lessons`,
  ENROLLMENTS: 'enrollments',
  COURSE_PROGRESS: 'courseProgress',
  LESSON_PROGRESS: 'lessonProgress',
  CERTIFICATES: 'certificates',
  LEARNING_SESSIONS: 'learningSessions',
  ACHIEVEMENTS: 'achievements',
  NOTES: 'notes',
} as const;

// Helper function to generate document IDs
export function generateEnrollmentId(userId: string, courseId: string): string {
  return `${userId}_${courseId}`;
}

export function generateLessonProgressId(userId: string, courseId: string, lessonId: string): string {
  return `${userId}_${courseId}_${lessonId}`;
}

export function generateCourseProgressId(userId: string, courseId: string): string {
  return `${userId}_${courseId}`;
}

export function generateCredentialId(courseId: string, userId: string, timestamp: Date): string {
  const datePart = timestamp.toISOString().split('T')[0].replace(/-/g, '');
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const courseCode = courseId.substring(0, 4).toUpperCase();
  return `CERT-${courseCode}-${datePart}-${randomPart}`;
}

import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  increment,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import {
  LessonProgress,
  CourseProgress,
  Enrollment,
  LearningSession,
  UserProfile,
  COLLECTIONS,
  generateLessonProgressId,
  generateCourseProgressId,
  generateEnrollmentId
} from '@/types/firestore';

/**
 * Progress Tracking Service
 * Handles all learning progress updates, time tracking, and XP calculations
 */
export class ProgressTrackingService {
  
  /**
   * Start a lesson and create initial progress record
   */
  static async startLesson(
    userId: string,
    courseId: string,
    lessonId: string,
    lessonDuration: number
  ): Promise<void> {
    const progressId = generateLessonProgressId(userId, courseId, lessonId);
    const progressRef = doc(db, COLLECTIONS.LESSON_PROGRESS, progressId);
    
    const existingProgress = await getDoc(progressRef);
    
    if (!existingProgress.exists()) {
      const lessonProgress: Omit<LessonProgress, 'id'> = {
        userId,
        courseId,
        lessonId,
        watchedSeconds: 0,
        totalDuration: lessonDuration,
        watchPercentage: 0,
        completed: false,
        lastPosition: 0,
        startedAt: new Date(),
        lastWatchedAt: new Date()
      };
      
      await setDoc(progressRef, {
        ...lessonProgress,
        startedAt: serverTimestamp(),
        lastWatchedAt: serverTimestamp()
      });
    }
  }
  
  /**
   * Update lesson progress as user watches video
   */
  static async updateLessonProgress(
    userId: string,
    courseId: string,
    lessonId: string,
    watchedSeconds: number,
    currentPosition: number,
    totalDuration: number
  ): Promise<void> {
    const progressId = generateLessonProgressId(userId, courseId, lessonId);
    const progressRef = doc(db, COLLECTIONS.LESSON_PROGRESS, progressId);
    
    const watchPercentage = Math.min(100, (watchedSeconds / totalDuration) * 100);
    const completed = watchPercentage >= 90; // 90% watched = completed
    
    const updates: any = {
      watchedSeconds,
      lastPosition: currentPosition,
      watchPercentage,
      completed,
      lastWatchedAt: serverTimestamp()
    };
    
    if (completed && !(await getDoc(progressRef)).data()?.completed) {
      updates.completedAt = serverTimestamp();
      
      // Award XP for completing lesson
      await this.awardXP(userId, 50); // 50 XP per lesson
      
      // Update course progress
      await this.updateCourseProgress(userId, courseId);
    }
    
    await updateDoc(progressRef, updates);
  }
  
  /**
   * Update overall course progress
   */
  static async updateCourseProgress(userId: string, courseId: string): Promise<void> {
    const progressId = generateCourseProgressId(userId, courseId);
    const progressRef = doc(db, COLLECTIONS.COURSE_PROGRESS, progressId);
    
    // Get all lesson progress for this course
    const lessonProgressQuery = query(
      collection(db, COLLECTIONS.LESSON_PROGRESS),
      where('userId', '==', userId),
      where('courseId', '==', courseId)
    );
    
    const lessonProgressSnap = await getDocs(lessonProgressQuery);
    const lessonProgresses = lessonProgressSnap.docs.map(doc => doc.data() as LessonProgress);
    
    const completedLessons = lessonProgresses.filter(lp => lp.completed).length;
    const totalLessons = lessonProgresses.length;
    const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    
    // Calculate total time spent
    const totalTimeSpent = lessonProgresses.reduce((sum, lp) => 
      sum + (lp.watchedSeconds / 60), 0
    );
    
    // Calculate mastery (based on completion and quiz scores)
    const mastery = Math.min(100, overallProgress * 0.7 + 30); // Simplified mastery calculation
    
    await setDoc(progressRef, {
      userId,
      courseId,
      overallProgress,
      lessonsCompleted: completedLessons,
      totalLessons,
      totalTimeSpent,
      mastery,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    // Update enrollment
    await this.updateEnrollment(userId, courseId, overallProgress);
    
    // Check if course is completed
    if (overallProgress >= 100) {
      await this.completeCourse(userId, courseId);
    }
  }
  
  /**
   * Complete a course and trigger certificate generation
   */
  static async completeCourse(userId: string, courseId: string): Promise<void> {
    const enrollmentId = generateEnrollmentId(userId, courseId);
    const enrollmentRef = doc(db, COLLECTIONS.ENROLLMENTS, enrollmentId);
    
    await updateDoc(enrollmentRef, {
      status: 'completed',
      progress: 100,
      completedAt: serverTimestamp()
    });
    
    // Update user stats
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      'stats.coursesCompleted': increment(1),
      'stats.coursesInProgress': increment(-1),
      'stats.totalXP': increment(500), // 500 XP for completing course
      updatedAt: serverTimestamp()
    });
    
    // Award achievement
    await this.checkAndAwardAchievements(userId);
  }
  
  /**
   * Update enrollment record
   */
  static async updateEnrollment(
    userId: string,
    courseId: string,
    progress: number
  ): Promise<void> {
    const enrollmentId = generateEnrollmentId(userId, courseId);
    const enrollmentRef = doc(db, COLLECTIONS.ENROLLMENTS, enrollmentId);
    
    await updateDoc(enrollmentRef, {
      progress,
      lastAccessedAt: serverTimestamp()
    });
  }
  
  /**
   * Record a learning session
   */
  static async recordLearningSession(
    userId: string,
    courseId: string,
    lessonId: string,
    durationMinutes: number,
    activityType: 'video' | 'quiz' | 'reading' | 'practice'
  ): Promise<void> {
    const sessionRef = doc(collection(db, COLLECTIONS.LEARNING_SESSIONS));
    const today = new Date().toISOString().split('T')[0];
    
    const session: Omit<LearningSession, 'id'> = {
      userId,
      courseId,
      lessonId,
      startTime: new Date(),
      duration: durationMinutes,
      activityType,
      xpEarned: Math.floor(durationMinutes * 2), // 2 XP per minute
      date: today
    };
    
    await setDoc(sessionRef, {
      ...session,
      startTime: serverTimestamp(),
      endTime: serverTimestamp()
    });
    
    // Update daily stats
    await this.updateDailyStats(userId, durationMinutes);
  }
  
  /**
   * Update daily learning stats and streak
   */
  static async updateDailyStats(userId: string, minutesLearned: number): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() as UserProfile;
    
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = userData.lastActivityAt 
      ? new Date(userData.lastActivityAt).toISOString().split('T')[0]
      : null;
    
    const updates: any = {
      'stats.totalHoursLearned': increment(minutesLearned / 60),
      lastActivityAt: serverTimestamp()
    };
    
    // Update streak
    if (lastActivity !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastActivity === yesterdayStr) {
        // Continue streak
        updates['stats.currentStreak'] = increment(1);
        
        const newStreak = (userData.stats.currentStreak || 0) + 1;
        if (newStreak > (userData.stats.longestStreak || 0)) {
          updates['stats.longestStreak'] = newStreak;
        }
      } else if (lastActivity !== today) {
        // Streak broken
        updates['stats.currentStreak'] = 1;
      }
    }
    
    await updateDoc(userRef, updates);
  }
  
  /**
   * Award XP to user and calculate level
   */
  static async awardXP(userId: string, xpAmount: number): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    const currentXP = userSnap.data()?.stats.totalXP || 0;
    const newXP = currentXP + xpAmount;
    
    // Level calculation: Level = floor(sqrt(XP / 100))
    const newLevel = Math.floor(Math.sqrt(newXP / 100));
    
    await updateDoc(userRef, {
      'stats.totalXP': newXP,
      'stats.level': newLevel
    });
  }
  
  /**
   * Check and award achievements based on user progress
   */
  static async checkAndAwardAchievements(userId: string): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() as UserProfile;
    
    // Check various achievement criteria
    const achievements = [];
    
    // First course completion
    if (userData.stats.coursesCompleted === 1) {
      achievements.push({
        type: 'first_course',
        name: 'First Steps',
        description: 'Complete your first course',
        rarity: 'common' as const
      });
    }
    
    // 7-day streak
    if (userData.stats.currentStreak >= 7) {
      achievements.push({
        type: 'week_streak',
        name: 'Week Warrior',
        description: 'Learn for 7 days in a row',
        rarity: 'rare' as const
      });
    }
    
    // Fast learner (5 courses in a month)
    if (userData.stats.coursesCompleted >= 5) {
      achievements.push({
        type: 'speed_learner',
        name: 'Speed Learner',
        description: 'Complete 5 courses',
        rarity: 'epic' as const
      });
    }
    
    // Save achievements
    for (const achievement of achievements) {
      const achievementRef = doc(collection(db, COLLECTIONS.ACHIEVEMENTS));
      await setDoc(achievementRef, {
        userId,
        ...achievement,
        progress: 1,
        requirement: 1,
        unlocked: true,
        unlockedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });
    }
  }
  
  /**
   * Get user's learning statistics
   */
  static async getUserStats(userId: string): Promise<any> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }
    
    const userData = userSnap.data() as UserProfile;
    
    // Get today's learning time
    const today = new Date().toISOString().split('T')[0];
    const sessionsQuery = query(
      collection(db, COLLECTIONS.LEARNING_SESSIONS),
      where('userId', '==', userId),
      where('date', '==', today)
    );
    
    const sessionsSnap = await getDocs(sessionsQuery);
    const todayMinutes = sessionsSnap.docs.reduce((sum, doc) => 
      sum + (doc.data().duration || 0), 0
    );
    
    // Get weekly learning time
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    
    const weekQuery = query(
      collection(db, COLLECTIONS.LEARNING_SESSIONS),
      where('userId', '==', userId),
      where('date', '>=', weekAgoStr)
    );
    
    const weekSnap = await getDocs(weekQuery);
    const weekMinutes = weekSnap.docs.reduce((sum, doc) => 
      sum + (doc.data().duration || 0), 0
    );
    
    return {
      ...userData.stats,
      todayMinutes: Math.round(todayMinutes),
      weekMinutes: Math.round(weekMinutes),
      todayHours: Number((todayMinutes / 60).toFixed(1)),
      weekHours: Number((weekMinutes / 60).toFixed(1))
    };
  }
}

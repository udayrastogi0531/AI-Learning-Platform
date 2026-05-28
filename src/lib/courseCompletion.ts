/**
 * Course Completion Handler
 * Automatically generates certificates and awards when courses are completed
 */

import { db } from './firebase';
import { doc, setDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { generateCertificateId, saveCertificateToFirestore, type CertificateData } from './certificate';

export interface CourseCompletionData {
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  instructorName?: string;
  finalGrade?: string;
  mastery?: number;
  completedAt: Date;
}

/**
 * Handle course completion - generate certificate and update user stats
 */
export async function handleCourseCompletion(data: CourseCompletionData): Promise<string> {
  try {
    // Generate certificate
    const certificateId = generateCertificateId();
    const certificateData: CertificateData = {
      userName: data.userName,
      courseName: data.courseName,
      completionDate: data.completedAt,
      courseId: data.courseId,
      grade: data.finalGrade,
      instructorName: data.instructorName,
      certificateId,
    };

    // Save certificate to Firestore
    await saveCertificateToFirestore(data.userId, certificateData, db);

    // Update user stats
    const userRef = doc(db, 'users', data.userId);
    await updateDoc(userRef, {
      coursesCompleted: increment(1),
      completedCourses: arrayUnion(data.courseId),
      xp: increment(calculateXPReward(data.mastery || 0)),
    });

    // Calculate and update level
    await updateUserLevel(data.userId);

    console.log('✅ Course completion handled:', certificateId);
    return certificateId;
  } catch (error) {
    console.error('Error handling course completion:', error);
    throw error;
  }
}

/**
 * Calculate XP reward based on course mastery
 */
function calculateXPReward(mastery: number): number {
  const baseXP = 100;
  const bonusXP = Math.floor((mastery / 100) * 200); // Up to 200 bonus XP for perfect score
  return baseXP + bonusXP;
}

/**
 * Update user level based on current XP
 */
async function updateUserLevel(userId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await import('firebase/firestore').then(m => m.getDoc(userRef));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const currentXP = userData.xp || 0;
      const currentLevel = userData.level || 1;
      
      // Level formula: level = floor(sqrt(xp / 100))
      const newLevel = Math.floor(Math.sqrt(currentXP / 100)) + 1;
      
      if (newLevel > currentLevel) {
        await updateDoc(userRef, {
          level: newLevel,
        });
        
        // Award level-up bonus XP
        await updateDoc(userRef, {
          xp: increment(50), // Bonus XP for leveling up
        });
        
        console.log(`🎉 Level up! User ${userId} is now level ${newLevel}`);
      }
    }
  } catch (error) {
    console.error('Error updating user level:', error);
  }
}

/**
 * Check if user should receive a certificate for a course
 */
export async function shouldAwardCertificate(
  userId: string,
  courseId: string,
  progressPercentage: number,
  mastery: number
): Promise<boolean> {
  // Award certificate if:
  // 1. Progress is 100%
  // 2. Mastery is at least 60%
  return progressPercentage >= 100 && mastery >= 60;
}

/**
 * Generate certificate notification message
 */
export function getCertificateNotificationMessage(courseName: string, grade?: string): string {
  return grade
    ? `🎉 Congratulations! You've earned a certificate for completing ${courseName} with a grade of ${grade}!`
    : `🎉 Congratulations! You've earned a certificate for completing ${courseName}!`;
}

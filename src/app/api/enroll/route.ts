import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { generateEnrollmentId, generateCourseProgressId } from '@/types/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, courseId } = body;
    if (!userId || !courseId) {
      return NextResponse.json({ error: 'userId and courseId required' }, { status: 400 });
    }

    const enrollmentId = generateEnrollmentId(userId, courseId);
    const enrollmentRef = doc(db, 'enrollments', enrollmentId);

    await setDoc(enrollmentRef, {
      id: enrollmentId,
      userId,
      courseId,
      status: 'active',
      progress: 0,
      enrolledAt: serverTimestamp(),
      lastAccessedAt: serverTimestamp()
    });

    // create course progress
    const progressId = generateCourseProgressId(userId, courseId);
    const progressRef = doc(db, 'courseProgress', progressId);
    await setDoc(progressRef, {
      id: progressId,
      userId,
      courseId,
      overallProgress: 0,
      lessonsCompleted: 0,
      totalLessons: 0,
      totalTimeSpent: 0,
      mastery: 0,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Enroll error', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}

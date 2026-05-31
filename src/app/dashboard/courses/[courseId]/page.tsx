'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';
import { Play, Clock } from 'lucide-react';

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const [course, setCourse] = useState<any | null>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [enrollment, setEnrollment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // Load course
        const ref = doc(db, 'courses', courseId);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setCourse(null);
        } else {
          if (mounted) setCourse({ id: snap.id, ...snap.data() });
        }

        // Load lessons
        const lessonsQuery = query(collection(db, `courses/${courseId}/lessons`), orderBy('order', 'asc'));
        const lessonsSnap = await getDocs(lessonsQuery);
        const lessonsData = lessonsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (mounted) setLessons(lessonsData);

        // Check enrollment status
        if (user) {
          const enrollmentRef = doc(db, 'enrollments', `${user.uid}_${courseId}`);
          const enrollmentSnap = await getDoc(enrollmentRef);
          if (enrollmentSnap.exists() && mounted) {
            setEnrollment(enrollmentSnap.data());
          }
        }
      } catch (err) {
        console.error('Error loading course', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login?redirect=/dashboard/courses/' + courseId);
      return;
    }

    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, courseId })
      });
      const data = await res.json();
      if (res.ok) {
        // Start with first lesson
        if (lessons.length > 0) {
          router.push(`/dashboard/courses/${courseId}/lessons/${lessons[0].id}`);
        } else {
          alert('No lessons available yet');
        }
      } else {
        alert(data?.error || 'Enrollment failed');
      }
    } catch (err) {
      console.error(err);
      alert('Enrollment error');
    }
  };

  const handleStartLesson = (lessonId: string) => {
    router.push(`/dashboard/courses/${courseId}/lessons/${lessonId}`);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!course) return <div className="p-6">Course not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Course Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {course.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {course.description}
              </p>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{lessons.length} lessons</span>
                </div>
                {course.duration && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {course.duration}
                  </div>
                )}
                {course.level && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    {course.level}
                  </span>
                )}
              </div>

              {enrollment ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => lessons.length > 0 && handleStartLesson(lessons[0].id)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Continue Learning</span>
                  </button>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Progress: {Math.round(enrollment.progress || 0)}%
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Enroll Now
                </button>
              )}
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-8">
              {course.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4 flex items-center justify-center text-gray-500">
                  No thumbnail
                </div>
              )}
              
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About this course</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {course.meta || 'Learn at your own pace'}
              </p>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Course Content
          </h2>
          
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => enrollment && handleStartLesson(lesson.id)}
                disabled={!enrollment}
                className={`
                  w-full text-left p-4 rounded-lg border-2 transition-all
                  ${enrollment
                    ? 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer'
                    : 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {lesson.title}
                    </h3>
                    {lesson.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {lesson.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    {lesson.video?.duration && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.floor(lesson.video.duration / 60)}:{(lesson.video.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                    {enrollment ? (
                      <Play className="w-5 h-5 text-blue-600" />
                    ) : (
                      <div className="text-sm text-gray-400">Enroll to access</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {lessons.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No lessons available yet. Check back soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

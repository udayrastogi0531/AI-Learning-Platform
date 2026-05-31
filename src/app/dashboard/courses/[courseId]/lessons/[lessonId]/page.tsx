'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import EnhancedVideoPlayer from '@/components/video/EnhancedVideoPlayer';
import { CertificateService } from '@/lib/certificate-service';
import { ProgressTrackingService } from '@/lib/progress-tracking';

export default function LessonPlayerPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  
  const [lesson, setLesson] = useState<any | null>(null);
  const [course, setCourse] = useState<any | null>(null);
  const [progress, setProgress] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificate, setCertificate] = useState<any | null>(null);

  useEffect(() => {
    if (!user) {
      router.push(`/login?redirect=/dashboard/courses/${courseId}/lessons/${lessonId}`);
      return;
    }

    let mounted = true;
    async function load() {
      try {
        // Load course
        const courseRef = doc(db, 'courses', courseId);
        const courseSnap = await getDoc(courseRef);
        if (!courseSnap.exists()) {
          console.error('Course not found');
          setLoading(false);
          return;
        }
        if (mounted) setCourse({ id: courseSnap.id, ...courseSnap.data() });

        // Load lesson
        const lessonRef = doc(db, `courses/${courseId}/lessons`, lessonId);
        const lessonSnap = await getDoc(lessonRef);
        if (!lessonSnap.exists()) {
          console.error('Lesson not found');
          setLoading(false);
          return;
        }
        if (mounted) setLesson({ id: lessonSnap.id, ...lessonSnap.data(), courseId });

        // Load all lessons for navigation
        const lessonsQuery = query(collection(db, `courses/${courseId}/lessons`), orderBy('order', 'asc'));
        const lessonsSnap = await getDocs(lessonsQuery);
        const lessons = lessonsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (mounted) setAllLessons(lessons);

        // Load progress
        const progressId = `${user!.uid}_${courseId}_${lessonId}`;
        const progressRef = doc(db, 'lessonProgress', progressId);
        const progressSnap = await getDoc(progressRef);
        if (progressSnap.exists() && mounted) {
          setProgress(progressSnap.data());
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading lesson:', error);
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [courseId, lessonId, user, router]);

  const handleComplete = async () => {
    if (!user || !lesson) return;

    try {
      // Check if course is now complete
      const courseProgressRef = doc(db, 'courseProgress', `${user.uid}_${courseId}`);
      const courseProgressSnap = await getDoc(courseProgressRef);
      
      if (courseProgressSnap.exists()) {
        const courseProgress = courseProgressSnap.data();
        
        // If course is 100% complete, generate certificate
        if (courseProgress.overallProgress >= 100) {
          console.log('Course completed! Generating certificate...');
          
          const cert = await CertificateService.generateCertificate(
            user.uid,
            courseId,
            courseProgress.mastery || 90
          );
          
          setCertificate(cert);
          setShowCertificate(true);
        }
      }
    } catch (error) {
      console.error('Error checking course completion:', error);
    }
  };

  const handleNext = () => {
    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      router.push(`/dashboard/courses/${courseId}/lessons/${nextLesson.id}`);
    } else {
      router.push(`/dashboard/courses/${courseId}`);
    }
  };

  const downloadCertificate = () => {
    if (certificate?.pdfUrl) {
      CertificateService.downloadCertificate(
        certificate.pdfUrl,
        `Certificate-${course?.title || 'Course'}.pdf`
      );
    }
  };

  const shareCertificate = (platform: 'linkedin' | 'twitter' | 'facebook') => {
    if (certificate) {
      CertificateService.shareCertificate(certificate, platform);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lesson || !course) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
        <button onClick={() => router.push('/dashboard/courses')} className="text-blue-600 hover:underline">
          ← Back to courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Certificate Modal */}
      {showCertificate && certificate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Congratulations!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                You&apos;ve completed {course.title}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
              <div className="text-center">
                <div className="text-sm opacity-90 mb-2">CERTIFICATE OF COMPLETION</div>
                <div className="text-2xl font-bold mb-4">{course.title}</div>
                <div className="text-sm opacity-90">Score: {certificate.finalScore}%</div>
                <div className="text-xs opacity-75 mt-2">
                  Credential ID: {certificate.credentialId}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={downloadCertificate}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Download PDF
              </button>
              <button
                onClick={() => shareCertificate('linkedin')}
                className="px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors"
              >
                Share LinkedIn
              </button>
              <button
                onClick={() => shareCertificate('twitter')}
                className="px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors"
              >
                Share Twitter
              </button>
            </div>

            <button
              onClick={() => {
                setShowCertificate(false);
                router.push('/dashboard/achievements');
              }}
              className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              View All Achievements →
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <button onClick={() => router.push('/dashboard/courses')} className="hover:text-blue-600">
            Courses
          </button>
          <span>/</span>
          <button onClick={() => router.push(`/dashboard/courses/${courseId}`)} className="hover:text-blue-600">
            {course.title}
          </button>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{lesson.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Player */}
          <div className="lg:col-span-2 space-y-6">
            <EnhancedVideoPlayer
              lesson={lesson}
              onComplete={handleComplete}
              onNext={handleNext}
              initialProgress={progress}
            />

            {/* Lesson Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {lesson.title}
              </h1>
              {lesson.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {lesson.description}
                </p>
              )}
              
              {/* Transcript */}
              {lesson.transcript && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Transcript</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 max-h-96 overflow-y-auto">
                    {lesson.transcript}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Course Content
              </h2>
              <div className="space-y-2">
                {allLessons.map((l, index) => (
                  <button
                    key={l.id}
                    onClick={() => router.push(`/dashboard/courses/${courseId}/lessons/${l.id}`)}
                    className={`
                      w-full text-left p-3 rounded-lg transition-colors
                      ${l.id === lessonId
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        ${l.id === lessonId
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                        }
                      `}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{l.title}</div>
                        {l.video?.duration && (
                          <div className="text-xs opacity-75">
                            {Math.floor(l.video.duration / 60)}:{(l.video.duration % 60).toString().padStart(2, '0')}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Resources */}
            {lesson.resources && lesson.resources.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Resources
                </h2>
                <div className="space-y-2">
                  {lesson.resources.map((resource: any) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="text-2xl">📄</div>
                      <div>
                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                          {resource.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {resource.type.toUpperCase()}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

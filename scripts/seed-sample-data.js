/*
  Seed sample data into Firestore using firebase-admin.
  Usage:
    1. Create a service account JSON and set GOOGLE_APPLICATION_CREDENTIALS env var to its path
    2. node scripts/seed-sample-data.js
*/

const admin = require('firebase-admin');
const fs = require('fs');

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

async function seed() {
  console.log('Seeding sample courses...');

  const courses = [
    {
      id: 'js-fundamentals',
      title: 'JavaScript Fundamentals',
      description: 'Learn the fundamentals of JavaScript, the language of the web.',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop',
      lessonsCount: 8,
      lessons: [
        { id: 'l1', title: 'Intro to JS', video: { type: 'youtube', url: 'https://www.youtube.com/watch?v=upDLs1sn7g4', duration: 300 }, captionsUrl: '' },
        { id: 'l2', title: 'Variables & Types', video: { type: 'youtube', url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', duration: 600 }, captionsUrl: '' }
      ],
      meta: 'Beginner friendly',
      createdAt: new Date()
    },
    {
      id: 'react-ts',
      title: 'React & TypeScript',
      description: 'Build scalable React apps with TypeScript.',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop',
      lessonsCount: 12,
      lessons: [],
      meta: 'Intermediate',
      createdAt: new Date()
    }
  ];

  for (const course of courses) {
    const ref = db.collection('courses').doc(course.id);
    await ref.set(course, { merge: true });
    console.log('Created', course.id);

    // add lessons subcollection
    if (course.lessons && course.lessons.length > 0) {
      for (const lesson of course.lessons) {
        await ref.collection('lessons').doc(lesson.id).set(lesson);
        console.log('  lesson', lesson.id);
      }
    }
  }

  console.log('Seeding users sample...');
  const userRef = db.collection('users').doc('user_sample_1');
  await userRef.set({
    uid: 'user_sample_1',
    email: 'student@example.com',
    displayName: 'Sample Student',
    role: 'learner',
    stats: { totalHoursLearned: 0, coursesCompleted: 0, coursesInProgress: 0, currentStreak: 0, longestStreak: 0, totalXP: 0, level: 1, mastery: 0 },
    preferences: { theme: 'system', language: 'en', autoplay: false, captionsDefault: true, emailNotifications: true, pushNotifications: false },
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  console.log('Done.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });

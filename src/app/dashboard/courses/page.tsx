'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, setDoc, deleteDoc } from 'firebase/firestore';
import Link from 'next/link';
import { 
  BookOpen, Clock, Star, Users, Play, Bookmark, BookMarked,
  Filter, Search, Grid, List, TrendingUp, Award, CheckCircle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Course {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  thumbnail?: string;
  lessonsCount?: number;
  duration?: string;
  instructor?: string;
  rating?: number;
  students?: number;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  category?: string;
  enrolled?: boolean;
  bookmarked?: boolean;
  progress?: number;
}

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookmarked, setShowBookmarked] = useState(false);

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadCourses = async () => {
    try {
      const snap = await getDocs(collection(db, 'courses'));
      const coursesData = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Course[];
      
      // Load user enrollments and bookmarks
      if (user) {
        const enrollmentsSnap = await getDocs(
          query(collection(db, 'courseProgress'), where('userId', '==', user.uid))
        );
        const enrolledIds = enrollmentsSnap.docs.map(d => d.data().courseId);
        
        const bookmarksSnap = await getDocs(
          query(collection(db, 'bookmarks'), where('userId', '==', user.uid))
        );
        const bookmarkedIds = bookmarksSnap.docs.map(d => d.data().courseId);
        
        coursesData.forEach(course => {
          course.enrolled = enrolledIds.includes(course.id);
          course.bookmarked = bookmarkedIds.includes(course.id);
          
          const progressDoc = enrollmentsSnap.docs.find(d => d.data().courseId === course.id);
          if (progressDoc) {                                             
            course.progress = progressDoc.data().overallProgress || 0;
          }
        });
      }
      
      setCourses(coursesData);
    } catch (err) {
      console.error('Error loading courses', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (courseId: string) => {
    if (!user) return;
    
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    try {
      const bookmarkId = `${user.uid}_${courseId}`;
      
      if (course.bookmarked) {
        await deleteDoc(doc(db, 'bookmarks', bookmarkId));
      } else {
        await setDoc(doc(db, 'bookmarks', bookmarkId), {
          userId: user.uid,
          courseId,
          createdAt: new Date()
        });
      }
      
      setCourses(courses.map(c => 
        c.id === courseId ? { ...c, bookmarked: !c.bookmarked } : c
      ));
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const categories = ['all', ...Array.from(new Set(courses.map(c => c.category).filter(Boolean)))];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    const matchesBookmark = !showBookmarked || course.bookmarked;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesBookmark;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-32 -mr-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mb-32 -ml-32"></div>
        
        <div className="relative">
          <h1 className="text-4xl font-bold mb-2 flex items-center space-x-3">
            <BookOpen className="h-10 w-10" />
            <span>Course Catalog</span>
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Explore our extensive course library and start learning
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{courses.length}</div>
              <div className="text-sm text-white/80">Total Courses</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{courses.filter(c => c.enrolled).length}</div>
              <div className="text-sm text-white/80">Enrolled</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{courses.filter(c => c.bookmarked).length}</div>
              <div className="text-sm text-white/80">Bookmarked</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">
                {courses.filter(c => c.enrolled && c.progress === 100).length}
              </div>
              <div className="text-sm text-white/80">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card variant="glass" className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>

              {/* Level Filter */}
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level}
                  </option>
                ))}
              </select>

              {/* Bookmarked Toggle */}
              <button
                onClick={() => setShowBookmarked(!showBookmarked)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showBookmarked
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Bookmark className="w-4 h-4 inline mr-2" />
                Bookmarked Only
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Courses Grid/List */}
      {filteredCourses.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No courses found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search term
          </p>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredCourses.map((course) => (
            <Card key={course.id} variant="glass" className="group hover:shadow-2xl transition-all duration-300 overflow-hidden">
              {viewMode === 'grid' ? (
                <div>
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    {course.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Level Badge */}
                    {course.level && (
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                          course.level === 'Beginner' ? 'bg-green-500/80 text-white' :
                          course.level === 'Intermediate' ? 'bg-blue-500/80 text-white' :
                          'bg-purple-500/80 text-white'
                        }`}>
                          {course.level}
                        </span>
                      </div>
                    )}

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(course.id)}
                      className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:scale-110 transition-transform"
                    >
                      {course.bookmarked ? (
                        <BookMarked className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Bookmark className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>

                    {/* Play Button Overlay */}
                    {course.enrolled && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="h-16 w-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform cursor-pointer">
                          <Play className="h-8 w-8 text-blue-600 ml-1" fill="currentColor" />
                        </div>
                      </div>
                    )}

                    {/* Progress Bar */}
                    {course.enrolled && course.progress !== undefined && course.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/30">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {course.description || course.meta || 'No description available'}
                    </p>

                    {/* Instructor */}
                    {course.instructor && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        By {course.instructor}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.lessonsCount || 0} lessons</span>
                        </div>
                        {course.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link href={`/dashboard/courses/${course.id}`}>
                      <Button 
                        variant={course.enrolled ? "secondary" : "gradient"}
                        className="w-full"
                        icon={course.enrolled ? <Play className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                      >
                        {course.enrolled ? 'Continue Learning' : 'View Course'}
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex gap-6">
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden">
                    {course.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-white opacity-50" />
                      </div>
                    )}
                    {course.enrolled && course.progress !== undefined && course.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/30">
                        <div className="h-full bg-blue-500" style={{ width: `${course.progress}%` }}></div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {course.title}
                          </h3>
                          {course.level && (
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              course.level === 'Beginner' ? 'bg-green-500 text-white' :
                              course.level === 'Intermediate' ? 'bg-blue-500 text-white' :
                              'bg-purple-500 text-white'
                            }`}>
                              {course.level}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {course.description || course.meta}
                        </p>
                        {course.instructor && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            By {course.instructor}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {course.lessonsCount || 0} lessons
                          </span>
                          {course.rating && (
                            <span className="flex items-center">
                              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                              {course.rating}
                            </span>
                          )}
                          {course.enrolled && (
                            <span className="flex items-center text-green-600 dark:text-green-400">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Enrolled
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <button
                          onClick={() => toggleBookmark(course.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                          {course.bookmarked ? (
                            <BookMarked className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Bookmark className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        <Link href={`/dashboard/courses/${course.id}`}>
                          <Button 
                            variant={course.enrolled ? "secondary" : "gradient"}
                            size="sm"
                          >
                            {course.enrolled ? 'Continue' : 'View'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

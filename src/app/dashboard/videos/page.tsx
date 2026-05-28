'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { 
  Play, Clock, Eye, BookmarkPlus, Search, Filter, 
  TrendingUp, Star, Calendar, ChevronRight, Grid, List,
  Video, Download, Share2, ThumbsUp
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  category: string;
  instructor: string;
  rating: number;
  uploadedAt: Date;
  progress?: number;
  isNew?: boolean;
  isPremium?: boolean;
  tags: string[];
}

export default function VideosPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent');

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    // Real embedded video data with actual YouTube links
    const mockVideos: VideoItem[] = [
      {
        id: 'dQw4w9WgXcQ',
        title: 'Introduction to Machine Learning - Complete Guide',
        description: 'Learn the fundamentals of ML algorithms and their applications in real-world scenarios. Perfect for beginners!',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '10:30',
        views: 12450,
        category: 'Machine Learning',
        instructor: 'Dr. Sarah Chen',
        rating: 4.9,
        uploadedAt: new Date('2024-11-01'),
        progress: 0,
        isNew: true,
        tags: ['ML', 'Algorithms', 'AI'],
      },
      {
        id: 'jNQXAC9IVRw',
        title: 'Python Programming in 10 Minutes',
        description: 'Quick introduction to Python programming language. Learn the basics in just 10 minutes!',
        thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
        duration: '10:15',
        views: 45890,
        category: 'Programming',
        instructor: 'Emma Rodriguez',
        rating: 4.8,
        uploadedAt: new Date('2024-10-28'),
        progress: 0,
        tags: ['Python', 'Basics', 'Programming'],
      },
      {
        id: 'aircAruvnKk',
        title: 'What is Neural Network? - 3Blue1Brown',
        description: 'Beautiful visualization explaining how neural networks work from scratch.',
        thumbnail: 'https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg',
        duration: '19:13',
        views: 18200,
        category: 'Deep Learning',
        instructor: 'Prof. Michael Zhang',
        rating: 5.0,
        uploadedAt: new Date('2024-10-25'),
        isPremium: false,
        tags: ['Neural Networks', 'Deep Learning', 'AI'],
      },
      {
        id: 'Tn6-PIqc4UM',
        title: 'React in 100 Seconds',
        description: 'Learn React basics in just 100 seconds. Quick and comprehensive overview.',
        thumbnail: 'https://img.youtube.com/vi/Tn6-PIqc4UM/maxresdefault.jpg',
        duration: '2:30',
        views: 87500,
        category: 'Web Development',
        instructor: 'Alex Johnson',
        rating: 4.9,
        uploadedAt: new Date('2024-10-20'),
        isNew: true,
        tags: ['React', 'Next.js', 'Web Dev'],
      },
      {
        id: 'rfscVS0vtbw',
        title: 'Learn Python - Full Course for Beginners',
        description: 'Complete Python tutorial for beginners. Learn Python programming fundamentals.',
        thumbnail: 'https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg',
        duration: '4:26:52',
        views: 15600,
        category: 'Data Science',
        instructor: 'freeCodeCamp',
        rating: 4.6,
        progress: 0,
        uploadedAt: new Date('2024-10-15'),
        tags: ['Python', 'Programming', 'Beginners'],
      },
      {
        id: 'M3XM3Ow4bNA',
        title: 'AWS in 10 Minutes',
        description: 'Learn Amazon Web Services basics and cloud computing fundamentals.',
        thumbnail: 'https://img.youtube.com/vi/M3XM3Ow4bNA/maxresdefault.jpg',
        duration: '10:41',
        views: 28700,
        category: 'Cloud Computing',
        instructor: 'Fireship',
        rating: 4.9,
        progress: 0,
        uploadedAt: new Date('2024-10-10'),
        tags: ['Cloud', 'AWS', 'DevOps'],
      },
    ];

    setVideos(mockVideos);
    setLoading(false);
  };

  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(videos.map(v => v.category)))],
    [videos]
  );

  const filteredVideos = useMemo(() => 
    videos
      .filter(video => {
        const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') return b.uploadedAt.getTime() - a.uploadedAt.getTime();
        if (sortBy === 'popular') return b.views - a.views;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      }),
    [videos, searchTerm, selectedCategory, sortBy]
  );

  const stats = useMemo(() => ({
    totalVideos: videos.length,
    totalWatchTime: videos.reduce((acc, v) => {
      const [hours, minutes] = v.duration.split(':').map(Number);
      return acc + (hours || 0) * 60 + (minutes || 0);
    }, 0),
    inProgress: videos.filter(v => v.progress && v.progress > 0).length,
    averageRating: (videos.reduce((acc, v) => acc + v.rating, 0) / videos.length).toFixed(1),
  }), [videos]);

  const handleVideoClick = useCallback((videoId: string) => {
    window.location.href = `/dashboard/videos/${videoId}`;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-32 -mr-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mb-32 -ml-32"></div>
        
        <div className="relative">
          <h1 className="text-4xl font-bold mb-2 flex items-center space-x-3">
            <Video className="h-10 w-10" />
            <span>Video Library</span>
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Explore our extensive collection of learning videos
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{stats.totalVideos}</div>
              <div className="text-sm text-white/80">Total Videos</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{Math.floor(stats.totalWatchTime / 60)}h</div>
              <div className="text-sm text-white/80">Content Hours</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <div className="text-sm text-white/80">In Progress</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold flex items-center space-x-1">
                <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                <span>{stats.averageRating}</span>
              </div>
              <div className="text-sm text-white/80">Avg. Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card variant="glass" className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos, topics, or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center space-x-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>

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
        </div>
      </Card>

      {/* Videos Grid/List */}
      {filteredVideos.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No videos found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filters
          </p>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => window.location.href = `/dashboard/videos/${video.id}`}
              onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/dashboard/videos/${video.id}`)}
              role="button"
              tabIndex={0}
            >
            <Card 
              variant="glass" 
              className="group hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {viewMode === 'grid' ? (
                <div>
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {video.isNew && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                          NEW
                        </span>
                      )}
                      {video.isPremium && (
                        <span className="px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded">
                          PREMIUM
                        </span>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded">
                        {video.duration}
                      </span>
                    </div>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="h-16 w-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform cursor-pointer">
                        <Play className="h-8 w-8 text-blue-600 ml-1" fill="currentColor" />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {video.progress && video.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/30">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${video.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {video.description}
                    </p>

                    {/* Instructor */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {video.instructor}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{(video.views / 1000).toFixed(1)}K</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{video.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {video.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        variant="gradient" 
                        className="flex-1" 
                        size="sm" 
                        icon={<Play className="h-4 w-4" />}
                        onClick={() => window.location.href = `/dashboard/videos/${video.id}`}
                      >
                        Watch
                      </Button>
                      <Button variant="secondary" size="sm" icon={<BookmarkPlus className="h-4 w-4" />} />
                      <Button variant="secondary" size="sm" icon={<Share2 className="h-4 w-4" />} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0 w-60 h-36 rounded-lg overflow-hidden group/thumb bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      sizes="240px"
                      className="object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                      loading="lazy"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                      <div className="h-12 w-12 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="h-6 w-6 text-blue-600 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <span className="px-2 py-1 bg-black/70 text-white text-xs rounded">
                        {video.duration}
                      </span>
                    </div>
                    {video.progress && video.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/30">
                        <div className="h-full bg-blue-500" style={{ width: `${video.progress}%` }}></div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {video.title}
                          </h3>
                          {video.isNew && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded">
                              NEW
                            </span>
                          )}
                          {video.isPremium && (
                            <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-semibold rounded">
                              PREMIUM
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {video.description}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          {video.instructor} • {video.category}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{(video.views / 1000).toFixed(1)}K views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{video.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{video.uploadedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {video.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button 
                          variant="gradient" 
                          size="sm" 
                          icon={<Play className="h-4 w-4" />}
                          onClick={() => window.location.href = `/dashboard/videos/${video.id}`}
                        >
                          Watch
                        </Button>
                        <Button variant="secondary" size="sm" icon={<BookmarkPlus className="h-4 w-4" />} />
                        <Button variant="secondary" size="sm" icon={<Share2 className="h-4 w-4" />} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
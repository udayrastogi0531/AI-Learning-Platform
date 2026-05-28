'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ThumbsUp, ThumbsDown, Share2, BookmarkPlus, BookMarked,
  Download, Star, Eye, Calendar, User, ChevronRight, Play
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { generateCertificateHTML, downloadCertificateAsHTML, generateCertificateId } from '@/lib/certificate';

interface VideoData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  views: number;
  category: string;
  instructor: string;
  rating: number;
  uploadedAt: Date;
  tags: string[];
  isPremium?: boolean;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  comment: string;
  timestamp: Date;
  likes: number;
}

export default function VideoWatchPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const videoId = params.videoId as string;

  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [relatedVideos, setRelatedVideos] = useState<VideoData[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [certificateGenerated, setCertificateGenerated] = useState<{
    html: string;
    fileName: string;
    data: any;
  } | null>(null);

  useEffect(() => {
    loadVideoData();
    loadBookmarkStatus();
    loadProgress();
    loadRelatedVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const loadVideoData = async () => {
    // Mock video data - replace with actual Firestore query
    const mockVideo: VideoData = {
      id: videoId,
      title: 'Introduction to Machine Learning Algorithms',
      description: `Welcome to this comprehensive guide on Machine Learning Algorithms! 

In this video, we'll explore:
• Fundamental ML concepts and terminology
• Supervised vs Unsupervised learning
• Popular algorithms and their use cases
• Real-world applications and examples
• Best practices for model selection

This course is perfect for beginners who want to understand the foundations of machine learning and for intermediate developers looking to strengthen their knowledge.

Prerequisites:
- Basic programming knowledge (Python recommended)
- Understanding of basic mathematics
- Enthusiasm to learn!

By the end of this video, you'll have a solid understanding of various ML algorithms and when to use them.`,
      videoUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfU', // Example YouTube video
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop',
      duration: '45:30',
      views: 12450,
      category: 'Machine Learning',
      instructor: 'Dr. Sarah Chen',
      rating: 4.9,
      uploadedAt: new Date('2024-11-01'),
      tags: ['ML', 'Algorithms', 'AI', 'Python'],
      isPremium: false,
    };

    setVideo(mockVideo);
    setLoading(false);

    // Increment view count
    if (user) {
      incrementViewCount();
    }
  };

  const loadBookmarkStatus = async () => {
    if (!user) return;
    
    try {
      const bookmarkRef = doc(db, 'bookmarks', `${user.uid}_${videoId}`);
      const bookmarkDoc = await getDoc(bookmarkRef);
      setIsBookmarked(bookmarkDoc.exists());
    } catch (error) {
      console.error('Error loading bookmark status:', error);
    }
  };

  const loadProgress = async () => {
    if (!user) return;

    try {
      const progressRef = doc(db, 'videoProgress', `${user.uid}_${videoId}`);
      const progressDoc = await getDoc(progressRef);
      
      if (progressDoc.exists()) {
        setCurrentProgress(progressDoc.data().progress || 0);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const loadRelatedVideos = () => {
    // Mock related videos
    const mockRelated: VideoData[] = [
      {
        id: '2',
        title: 'Deep Learning Fundamentals',
        description: 'Master the basics of deep learning',
        videoUrl: 'https://example.com/video2.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop',
        duration: '52:15',
        views: 18200,
        category: 'Deep Learning',
        instructor: 'Prof. Michael Zhang',
        rating: 5.0,
        uploadedAt: new Date('2024-10-25'),
        tags: ['Deep Learning', 'Neural Networks'],
      },
      {
        id: '3',
        title: 'Python for Data Science',
        description: 'Learn Python specifically for data science applications',
        videoUrl: 'https://example.com/video3.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop',
        duration: '1:12:45',
        views: 23890,
        category: 'Programming',
        instructor: 'Emma Rodriguez',
        rating: 4.8,
        uploadedAt: new Date('2024-10-28'),
        tags: ['Python', 'Data Science'],
      },
    ];

    setRelatedVideos(mockRelated);
  };

  const incrementViewCount = async () => {
    try {
      const viewRef = doc(db, 'videoViews', `${user?.uid}_${videoId}`);
      const viewDoc = await getDoc(viewRef);

      if (!viewDoc.exists()) {
        await setDoc(viewRef, {
          userId: user?.uid,
          videoId,
          viewedAt: new Date(),
          viewCount: 1,
        });
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const handleTimeUpdate = async (currentTime: number, duration: number) => {
    if (!user || !duration) return;

    const progress = (currentTime / duration) * 100;
    setCurrentProgress(progress);

    // Save progress every 10 seconds
    if (Math.floor(currentTime) % 10 === 0) {
      try {
        const progressRef = doc(db, 'videoProgress', `${user.uid}_${videoId}`);
        await setDoc(progressRef, {
          userId: user.uid,
          videoId,
          progress,
          currentTime,
          duration,
          lastWatched: new Date(),
        }, { merge: true });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  const handleVideoEnded = async () => {
    if (!user || !video) return;

    try {
      const progressRef = doc(db, 'videoProgress', `${user.uid}_${videoId}`);
      await setDoc(progressRef, {
        userId: user.uid,
        videoId,
        progress: 100,
        completed: true,
        completedAt: new Date(),
      }, { merge: true });

      // Add to completed videos and update stats
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        completedVideos: arrayUnion(videoId),
        videosWatched: increment(1),
      });

      // Generate certificate
      const userName = user.displayName || 'Learner';
      const certificateId = generateCertificateId();
      const completionDate = new Date();
      
      // Create certificate data matching the CertificateData interface
      const certificateData = {
        certificateId,
        userName,
        courseName: video.title,
        courseId: videoId,
        completionDate,
        grade: 'Completed',
        instructorName: video.instructor,
      };

      // Save certificate to Firestore
      const certificateRef = doc(db, 'certificates', certificateId);
      await setDoc(certificateRef, {
        ...certificateData,
        userId: user.uid,
        type: 'video',
        videoId,
        courseCategory: video.category,
        createdAt: completionDate,
      });

      // Generate certificate HTML
      const certificateHTML = generateCertificateHTML(certificateData);
      
      // Store in state for re-download
      setCertificateGenerated({
        html: certificateHTML,
        fileName: `${video.title.replace(/[^a-z0-9]/gi, '_')}_Certificate.html`,
        data: certificateData,
      });

      // Auto-download certificate
      downloadCertificateAsHTML(certificateData);
      
    } catch (error) {
      console.error('Error marking video as complete:', error);
    }
  };

  const toggleBookmark = async () => {
    if (!user) return;

    try {
      const bookmarkRef = doc(db, 'bookmarks', `${user.uid}_${videoId}`);

      if (isBookmarked) {
        await setDoc(bookmarkRef, {
          userId: user.uid,
          videoId,
          type: 'video',
          bookmarkedAt: new Date(),
        });
      } else {
        // Remove bookmark
        const bookmarkDoc = await getDoc(bookmarkRef);
        if (bookmarkDoc.exists()) {
          await setDoc(bookmarkRef, {}, { merge: false });
        }
      }

      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video?.title,
          text: video?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Video not found</h2>
        <Button onClick={() => router.push('/dashboard/videos')} variant="gradient">
          Back to Videos
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Video Player */}
      <Card variant="glass" className="overflow-hidden">
        <VideoPlayer
          videoUrl={video.videoUrl}
          title={video.title}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          initialProgress={currentProgress}
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Info */}
          <Card variant="glass" className="p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {video.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>{video.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{video.uploadedAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{video.rating} rating</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Button 
                variant="secondary" 
                size="sm" 
                icon={<ThumbsUp className="h-4 w-4" />}
              >
                Like
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                icon={<ThumbsDown className="h-4 w-4" />}
              >
                Dislike
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                icon={isBookmarked ? <BookMarked className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
                onClick={toggleBookmark}
              >
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                icon={<Share2 className="h-4 w-4" />}
                onClick={handleShare}
              >
                Share
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                icon={<Download className="h-4 w-4" />}
              >
                Download
              </Button>
            </div>

            {/* Certificate Download Section */}
            {certificateGenerated && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500 dark:border-green-400 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-green-700 dark:text-green-300 flex items-center mb-2">
                      🎉 Congratulations! Video Completed
                    </h4>
                    <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                      Your certificate has been generated and downloaded automatically. You can download it again below.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="gradient"
                        size="sm"
                        icon={<Download className="h-4 w-4" />}
                        onClick={() => {
                          if (certificateGenerated) {
                            downloadCertificateAsHTML(certificateGenerated.data);
                          }
                        }}
                      >
                        Download Certificate
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push('/dashboard/certificates')}
                      >
                        View All Certificates
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Instructor Info */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-6">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{video.instructor}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{video.category} Expert</p>
              </div>
              <Button variant="gradient" size="sm" className="ml-auto">
                Follow
              </Button>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About this video</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {video.description}
              </p>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Comments Section */}
          <Card variant="glass" className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Comments ({comments.length})
            </h3>

            {/* Add Comment */}
            {user && (
              <div className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="secondary" size="sm" onClick={() => setNewComment('')}>
                    Cancel
                  </Button>
                  <Button variant="gradient" size="sm" disabled={!newComment.trim()}>
                    Comment
                  </Button>
                </div>
              </div>
            )}

            {/* Comments List */}
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">{comment.userName}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {comment.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.comment}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{comment.likes}</span>
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Related Videos */}
          <Card variant="glass" className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Related Videos</h3>
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo) => (
                <div
                  key={relatedVideo.id}
                  onClick={() => router.push(`/dashboard/videos/${relatedVideo.id}`)}
                  onKeyDown={(e) => e.key === 'Enter' && router.push(`/dashboard/videos/${relatedVideo.id}`)}
                  role="button"
                  tabIndex={0}
                  className="flex gap-3 cursor-pointer group"
                >
                  <div className="relative w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={relatedVideo.thumbnail}
                      alt={relatedVideo.title}
                      fill
                      sizes="160px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      quality={80}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-8 w-8 text-white" fill="white" />
                    </div>
                    <div className="absolute bottom-1 right-1">
                      <span className="px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                        {relatedVideo.duration}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {relatedVideo.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{relatedVideo.instructor}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{(relatedVideo.views / 1000).toFixed(1)}K</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{relatedVideo.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Progress Card */}
          {currentProgress > 0 && (
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Math.round(currentProgress)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${currentProgress}%` }}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

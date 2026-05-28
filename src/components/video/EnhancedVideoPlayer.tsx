'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Settings,
  SkipBack, SkipForward, Subtitles, PlayCircle, CheckCircle2
} from 'lucide-react';
import { ProgressTrackingService } from '@/lib/progress-tracking';
import { useAuth } from '@/lib/auth-context';

interface VideoPlayerProps {
  lesson: {
    id: string;
    courseId: string;
    title: string;
    video: {
      type: 'youtube' | 'vimeo' | 'storage' | 'external';
      url: string;
      duration: number;
    };
    transcript?: string;
  };
  onComplete?: () => void;
  onNext?: () => void;
  initialProgress?: {
    lastPosition: number;
    completed: boolean;
  };
}

export default function EnhancedVideoPlayer({ lesson, onComplete, onNext, initialProgress }: VideoPlayerProps) {
  const { user } = useAuth();
  const playerRef = useRef<any>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(lesson.video.duration);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [totalWatchedSeconds, setTotalWatchedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(initialProgress?.completed || false);
  
  const progressUpdateInterval = useRef<NodeJS.Timeout>();
  const sessionStartTime = useRef<Date>(new Date());
  
  // Load initial position
  useEffect(() => {
    if (initialProgress?.lastPosition && playerRef.current) {
      // @ts-ignore - ReactPlayer types issue
      playerRef.current.seekTo(initialProgress.lastPosition, 'seconds');
    }
  }, [initialProgress]);
  
  const updateProgress = async () => {
    if (!user) return;
    
    try {
      await ProgressTrackingService.updateLessonProgress(
        user.uid,
        lesson.courseId,
        lesson.id,
        totalWatchedSeconds + playedSeconds,
        playedSeconds,
        duration
      );
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };
  
  // Track progress every 5 seconds
  useEffect(() => {
    if (playing && user) {
      progressUpdateInterval.current = setInterval(() => {
        updateProgress();
      }, 5000);
    }
    
    return () => {
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, playedSeconds, user]);
  
  const handleProgress = (state: any) => {
    setPlayed(state.played);
    setPlayedSeconds(state.playedSeconds);
    
    // Calculate total watched (don't count rewatching)
    if (state.playedSeconds > totalWatchedSeconds) {
      setTotalWatchedSeconds(state.playedSeconds);
    }
    
    // Auto-complete at 90%
    if (state.played >= 0.9 && !isCompleted) {
      handleVideoComplete();
    }
  };
  
  const handleVideoComplete = async () => {
    setIsCompleted(true);
    
    if (user) {
      // Final progress update
      await updateProgress();
      
      // Record learning session
      const sessionDuration = (new Date().getTime() - sessionStartTime.current.getTime()) / 60000;
      await ProgressTrackingService.recordLearningSession(
        user.uid,
        lesson.courseId,
        lesson.id,
        sessionDuration,
        'video'
      );
    }
    
    if (onComplete) {
      onComplete();
    }
  };
  
  const handlePlayPause = () => {
    setPlaying(!playing);
    
    if (!playing && user) {
      // Start lesson tracking
      ProgressTrackingService.startLesson(
        user.uid,
        lesson.courseId,
        lesson.id,
        duration
      );
    }
  };
  
  const handleSeek = (value: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(value, 'fraction');
      setPlayed(value);
    }
  };
  
  const handleSkip = (seconds: number) => {
    if (playerRef.current) {
      const newTime = playedSeconds + seconds;
      playerRef.current.seekTo(newTime, 'seconds');
    }
  };
  
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };
  
  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  
  return (
    <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
      {/* Video Player */}
      <div 
        className="relative aspect-video"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <ReactPlayer
          ref={playerRef}
          url={lesson.video.url}
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          onProgress={handleProgress}
          onDuration={setDuration}
          onEnded={handleVideoComplete}
          width="100%"
          height="100%"
          config={{
            youtube: {
              // @ts-ignore - YouTube config types
              playerVars: { modestbranding: 1 }
            }
          }}
        />
        
        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Completed</span>
          </div>
        )}
        
        {/* Controls Overlay */}
        {showControls && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 flex flex-col justify-end p-6 transition-opacity">
            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min={0}
                max={0.999999}
                step="any"
                value={played}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${played * 100}%, #4b5563 ${played * 100}%, #4b5563 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-300 mt-1">
                <span>{formatTime(playedSeconds)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Play/Pause */}
                <button
                  onClick={handlePlayPause}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label={playing ? 'Pause' : 'Play'}
                >
                  {playing ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white" />
                  )}
                </button>
                
                {/* Skip Back/Forward */}
                <button
                  onClick={() => handleSkip(-10)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Skip back 10 seconds"
                >
                  <SkipBack className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => handleSkip(10)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Skip forward 10 seconds"
                >
                  <SkipForward className="w-6 h-6 text-white" />
                </button>
                
                {/* Volume */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setMuted(!muted)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label={muted ? 'Unmute' : 'Mute'}
                  >
                    {muted ? (
                      <VolumeX className="w-6 h-6 text-white" />
                    ) : (
                      <Volume2 className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                {/* Time Display */}
                <span className="text-white text-sm font-medium">
                  {formatTime(playedSeconds)} / {formatTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Transcript Toggle */}
                {lesson.transcript && (
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className={`p-2 hover:bg-white/20 rounded-full transition-colors ${showTranscript ? 'bg-blue-500' : ''}`}
                    aria-label="Toggle transcript"
                  >
                    <Subtitles className="w-6 h-6 text-white" />
                  </button>
                )}
                
                {/* Settings */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Settings"
                  >
                    <Settings className="w-6 h-6 text-white" />
                  </button>
                  
                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg p-4 min-w-[200px] shadow-xl">
                      <div className="text-white text-sm space-y-3">
                        <div>
                          <div className="font-medium mb-2">Playback Speed</div>
                          <div className="grid grid-cols-4 gap-2">
                            {playbackRates.map((rate) => (
                              <button
                                key={rate}
                                onClick={() => {
                                  setPlaybackRate(rate);
                                  setShowSettings(false);
                                }}
                                className={`px-2 py-1 rounded ${
                                  playbackRate === rate
                                    ? 'bg-blue-500'
                                    : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                              >
                                {rate}x
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Fullscreen */}
                <button
                  onClick={() => {
                    const element = document.querySelector('.relative.bg-black');
                    if (element) {
                      if (document.fullscreenElement) {
                        document.exitFullscreen();
                      } else {
                        element.requestFullscreen();
                      }
                    }
                  }}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Fullscreen"
                >
                  <Maximize className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Transcript Panel */}
      {showTranscript && lesson.transcript && (
        <div className="bg-gray-900 text-white p-6 max-h-64 overflow-y-auto">
          <h3 className="font-bold text-lg mb-3">Transcript</h3>
          <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {lesson.transcript}
          </div>
        </div>
      )}
      
      {/* Next Lesson Button */}
      {isCompleted && onNext && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
          <button
            onClick={onNext}
            className="w-full flex items-center justify-center space-x-2 bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Continue to Next Lesson</span>
          </button>
        </div>
      )}
    </div>
  );
}

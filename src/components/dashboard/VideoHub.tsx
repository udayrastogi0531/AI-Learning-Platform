'use client';

import React from 'react';
import ReactPlayer from 'react-player';
import Image from 'next/image';
import { Play, Download, List, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const recommendations = [
  { id: 'v1', title: 'Intro: What is AI?', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=240&fit=crop', duration: '12:34' },
  { id: 'v2', title: 'Neural Networks Explained', thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=240&fit=crop', duration: '22:10' },
  { id: 'v3', title: 'Training Models (Hands on)', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=240&fit=crop', duration: '18:05' },
];

const playlist = [
  { id: 'l1', title: 'Lesson 1 — Overview', watched: true, duration: '12:34' },
  { id: 'l2', title: 'Lesson 2 — Data', watched: false, duration: '18:20' },
  { id: 'l3', title: 'Lesson 3 — Models', watched: false, duration: '22:10' },
];

export function VideoHub() {
  const [url, setUrl] = React.useState('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4');
  const [playing, setPlaying] = React.useState(true);
  const [muted, setMuted] = React.useState(false);
  const [current, setCurrent] = React.useState(playlist[0]);

  function selectFromPlaylist(item: typeof playlist[number]){
    // In a real app we'd map id -> video url from Firestore
    setCurrent(item);
    // temporary: reuse sample url
    setUrl('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4');
    setPlaying(true);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Player area */}
      <Card className="lg:col-span-2 p-4">
        <div className="relative bg-black/90 rounded-lg overflow-hidden" style={{ paddingTop: '56.25%' }}>
          <div className="absolute inset-0">
            <ReactPlayer
              src={url}
              playing={playing}
              muted={muted}
              controls={true}
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <h3 className="text-lg font-semibold">{current.title || 'Lesson'}</h3>
            <p className="text-sm text-gray-500">Instructor • {current.duration}</p>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="secondary" onClick={() => setPlaying(p => !p)}>
              {playing ? 'Pause' : 'Play'}
            </Button>
            <Button variant="primary" onClick={() => setMuted(m => !m)}>
              {muted ? 'Unmute' : 'Mute'}
            </Button>
            <Button variant="ghost" onClick={() => window.open(url, '_blank')}>
              <Download className="mr-2" />Download
            </Button>
          </div>
        </div>

        {/* Recommendations carousel (simple horizontal scroll) */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold mb-2">Recommended</h4>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {recommendations.map(r => (
              <div key={r.id} className="w-64 min-w-[16rem] bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-36 bg-gray-100">
                  <Image 
                    alt={r.title} 
                    src={r.thumbnail} 
                    fill
                    className="object-cover"
                    sizes="256px"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">{r.duration}</div>
                </div>
                <div className="p-3">
                  <div className="font-semibold mb-1">{r.title}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <Play className="h-4 w-4" /> Preview
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Playlist sidebar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Playlist</h4>
          <div className="text-sm text-gray-500">{playlist.length} lessons</div>
        </div>

        <ul className="space-y-3">
          {playlist.map(item => (
            <button 
              key={item.id} 
              className={`w-full flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors ${current.id === item.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`} 
              onClick={() => selectFromPlaylist(item)}
            >
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${item.watched ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                  <List className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.duration}</div>
                </div>
              </div>

              <div className="text-xs text-gray-500">{item.watched ? 'Watched' : 'Unwatched'}</div>
            </button>
          ))}
        </ul>

        <div className="mt-6">
          <Button variant="ghost" onClick={() => alert('Download playlist stub')}>
            <Download className="mr-2"/> Download all
          </Button>
        </div>
      </Card>
    </div>
  );
}

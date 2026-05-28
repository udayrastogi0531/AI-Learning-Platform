'use client';

import { VideoHub } from '@/components/dashboard/VideoHub';

export default function VideoPage(){
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Video & Media Hub</h1>
      <VideoHub />
    </div>
  );
}

'use client';

import React, { Suspense } from 'react';
import { VideoHub } from '@/components/dashboard/VideoHub';

export default function VideoPage(){
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Video & Media Hub</h1>
      <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-xl"></div>}>
        <VideoHub />
      </Suspense>
    </div>
  );
}


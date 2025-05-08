
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingRewards() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Rewards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    </div>
  );
}

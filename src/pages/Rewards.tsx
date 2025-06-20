import React from 'react';
import { RewardsList } from '@/components/reward/RewardsList';
import { useApp } from '@/contexts/AppContext';
import { Skeleton } from '@/components/ui/skeleton';
import BackToMainMenu from '@/components/BackToMainMenu';

export default function RewardsPage() {
  const { isLoading, hasPartner } = useApp();
  
  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <div className="mb-4">
        <BackToMainMenu />
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Rewards</h1>
      </div>
      {isLoading ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      ) : !hasPartner ? (
        <div className="text-center p-12 border rounded-lg bg-muted/20">
          <h2 className="text-xl font-semibold mb-2">Connect with Your Partner First</h2>
          <p className="text-muted-foreground">
            You need to connect with your partner before you can create and redeem rewards.
          </p>
        </div>
      ) : (
        <RewardsList />
      )}
    </div>
  );
}

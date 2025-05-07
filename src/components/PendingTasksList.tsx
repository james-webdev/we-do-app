
import React, { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import PendingTaskCard from './PendingTaskCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const PendingTasksList = () => {
  const { pendingTasks, partner, refreshData, isLoading } = useApp();
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);
  const [localRefreshing, setLocalRefreshing] = useState(false);

  // Refresh data when component mounts to ensure we have the latest pending tasks
  useEffect(() => {
    if (!initialLoadAttempted) {
      refreshData();
      setInitialLoadAttempted(true);
    }
  }, [refreshData, initialLoadAttempted]);

  // Manual refresh function with visual feedback
  const handleManualRefresh = async () => {
    setLocalRefreshing(true);
    await refreshData();
    // Short timeout to ensure UI shows the refresh animation
    setTimeout(() => setLocalRefreshing(false), 500);
  };

  // If there are no pending tasks and we're not still loading, don't render anything
  if (pendingTasks.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card className="mb-8 border-amber-200 bg-amber-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <CardTitle>Tasks Pending Your Approval</CardTitle>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleManualRefresh}
            disabled={isLoading || localRefreshing}
            className="h-8 px-2"
          >
            <RefreshCcw className={`h-4 w-4 ${(isLoading || localRefreshing) ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>
          Review and approve tasks submitted by your partner
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {isLoading ? (
            // Show skeleton loaders while data is loading
            Array(2).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))
          ) : pendingTasks.map((task) => (
            <PendingTaskCard
              key={task.id}
              task={task}
              userName={partner?.name || 'Partner'}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingTasksList;

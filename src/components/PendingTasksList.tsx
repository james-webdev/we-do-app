
import React, { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import PendingTaskCard from './PendingTaskCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCcw, ClipboardCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const PendingTasksList = ({ limit = 5 }: { limit?: number }) => {
  const { pendingTasks, partner, refreshData, isLoading } = useApp();
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);
  const [localRefreshing, setLocalRefreshing] = useState(false);
  
  // Limit the number of pending tasks to display
  const limitedPendingTasks = pendingTasks.slice(0, limit);

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

  // Always show the section, even if there are no pending tasks

  return (
    <Card className="mb-8 border-purple-100 bg-purple-50/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-purple-500" />
            <CardTitle>Actions Pending Your Approval</CardTitle>
          </div>
        </div>
        <CardDescription>
          Review and approve actions submitted by your partner
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
          ) : limitedPendingTasks.length > 0 ? (
            limitedPendingTasks.map((task) => (
              <PendingTaskCard
                key={task.id}
                task={task}
                userName={partner?.name || 'Partner'}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <ClipboardCheck className="h-7 w-7 text-blue-500" />
              </div>
              <p className="text-lg font-medium">No pending actions</p>
              <p className="text-sm text-muted-foreground">
                All actions from {partner?.name || 'your partner'} have been reviewed
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingTasksList;

import React, { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HourglassIcon, RefreshCcw, ClipboardList } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { calculateTaskPointsDescription } from '@/utils/taskUtils';
import { TypeBadge } from '@/components/LoadBadge';
import ActionPointBadge from '@/components/ActionPointBadge';

const MyPendingTasksList = ({ limit = 5 }: { limit?: number }) => {
  const { myPendingTasks, partner, refreshData, isLoading } = useApp();
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);
  const [localRefreshing, setLocalRefreshing] = useState(false);
  
  // Limit the number of pending tasks to display
  const limitedPendingTasks = myPendingTasks.slice(0, limit);

  // Refresh data when component mounts to ensure we have the latest pending tasks
  useEffect(() => {
    if (!initialLoadAttempted) {
      refreshData();
      setInitialLoadAttempted(true);
    }
  }, [initialLoadAttempted, refreshData]);

  // Manual refresh function with visual feedback
  const handleManualRefresh = async () => {
    setLocalRefreshing(true);
    await refreshData();
    // Short timeout to ensure UI shows the refresh animation
    setTimeout(() => setLocalRefreshing(false), 500);
  };

  return (
    <Card className="mb-8 border-blue-100 bg-blue-50/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HourglassIcon className="h-5 w-5 text-blue-500" />
            <CardTitle>Your Actions Pending Approval</CardTitle>
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
          Actions you've submitted waiting for {partner?.name || 'your partner'} to approve
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
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))
          ) : limitedPendingTasks.length > 0 ? (
            limitedPendingTasks.map((task) => (
              <Card key={task.id} className="w-full">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900">{task.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted on {format(new Date(task.timestamp), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex gap-2">
                        <TypeBadge type={task.type} />
                        <ActionPointBadge points={task.rating} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <ClipboardList className="h-7 w-7 text-blue-500" />
              </div>
              <p className="text-lg font-medium">No pending actions</p>
              <p className="text-sm text-muted-foreground">
                All your actions have been reviewed by {partner?.name || 'your partner'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MyPendingTasksList;

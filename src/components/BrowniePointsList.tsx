import React, { FC } from 'react';
import { useApp } from '@/contexts/AppContext';
import BrowniePointCard from './BrowniePointCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BrowniePointsListProps {
  limit?: number;
}

const BrowniePointsList: FC<BrowniePointsListProps> = ({ limit = 8 }) => {
  const { browniePoints, currentUser, isLoading, refreshData } = useApp();
  const [localRefreshing, setLocalRefreshing] = React.useState(false);
  
  // Filter brownie points that the user received (not the ones they sent)
  // Focus on custom brownie points
  const userBrowniePoints = browniePoints
    .filter(point => 
      point.toUserId === currentUser?.id && 
      point.type === 'custom'
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
  
  const handleRefresh = async () => {
    setLocalRefreshing(true);
    await refreshData();
    // Add a short delay for UI feedback
    setTimeout(() => setLocalRefreshing(false), 500);
  };
  
  if (isLoading) {
    // Show skeleton loading state
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="p-4 border border-gray-100 rounded-md">
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-1/2 mt-4" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="ghost" 
          onClick={handleRefresh} 
          size="sm"
          title="Refresh brownie points"
          disabled={localRefreshing}
        >
          <RefreshCcw className={`h-4 w-4 ${localRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {userBrowniePoints.length === 0 ? (
        <div className="flex justify-between items-center p-4">
          <p className="text-center text-gray-500 w-full">No custom brownie points yet. Send one to your partner!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userBrowniePoints.map(point => (
            <BrowniePointCard 
              key={point.id} 
              browniePoint={point}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowniePointsList;

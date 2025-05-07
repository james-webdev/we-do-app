
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';

const PointsDisplay = () => {
  const { availablePoints, browniePoints, currentUser } = useApp();
  
  const receivedPoints = browniePoints.filter(point => 
    point.toUserId === currentUser?.id
  ).reduce((total, point) => total + point.points, 0);
  
  const sentPoints = browniePoints.filter(point => 
    point.fromUserId === currentUser?.id
  ).reduce((total, point) => total + point.points, 0);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy size={18} className="text-yellow-500" />
            Available Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-center my-4">
            {availablePoints}
          </div>
          <p className="text-sm text-gray-500 text-center">
            You can use these points to redeem rewards
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Point Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Received</span>
              <span className="font-medium">{receivedPoints} pts</span>
            </div>
            <Progress value={(receivedPoints / (receivedPoints + sentPoints || 1)) * 100} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Sent</span>
              <span className="font-medium">{sentPoints} pts</span>
            </div>
            <Progress value={(sentPoints / (receivedPoints + sentPoints || 1)) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PointsDisplay;

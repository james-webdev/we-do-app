
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ContributionChart from '@/components/charts/ContributionChart';
import TaskCard from '@/components/TaskCard';
import BrowniePointCard from '@/components/BrowniePointCard';
import { Award } from 'lucide-react';
import PendingTasksList from '@/components/PendingTasksList';
import ConnectPartner from '@/components/ConnectPartner';

const Dashboard = () => {
  const { currentUser, partner, tasks, browniePoints, summary, availablePoints, isLoading, hasPartner } = useApp();

  // Get the most recent tasks and brownie points
  const recentTasks = [...tasks].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 3);

  const recentBrowniePoints = [...browniePoints].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-[200px] w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
        </div>
      </div>
    );
  }

  // Show partner connection screen if user doesn't have a partner yet
  if (!hasPartner) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome to FairShare</h1>
        <div className="max-w-md mx-auto">
          <ConnectPartner />
          
          <div className="mt-8 text-center text-gray-600">
            <p className="mb-4">To start using FairShare, connect with your partner first.</p>
            <p className="text-sm">
              Don't have a partner on FairShare yet? Ask them to sign up and then connect using their email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Link to="/add-task">
            <Button>Add New Task</Button>
          </Link>
          <Link to="/give-brownie-point">
            <Button variant="outline">
              Send Brownie Point
              <span className="ml-2 bg-primary-light text-primary px-2 py-0.5 rounded-full text-xs">
                {summary?.browniePointsRemaining || 0} left
              </span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Contribution</CardTitle>
            <CardDescription>Tasks completed by each partner</CardDescription>
          </CardHeader>
          <CardContent>
            <ContributionChart 
              userTaskCount={summary?.userTaskCount || 0} 
              partnerTaskCount={summary?.partnerTaskCount || 0} 
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{summary?.totalTasks || 0}</div>
            <p className="text-sm text-gray-500 mt-1">in the last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Your Contribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{summary?.userContribution || 0}%</div>
            <p className="text-sm text-gray-500 mt-1">of total tasks</p>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <span>Brownie Points</span>
              <Link to="/rewards" className="ml-auto">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View Rewards
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-4xl font-bold">{summary?.sentBrowniePoints || 0}</div>
                <p className="text-sm text-gray-500 mt-1">sent this week</p>
              </div>
              <div className="flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                <Award className="mr-1" size={16} />
                <span className="font-medium">{availablePoints} available</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Tasks</h2>
            <Link to="/history" className="text-primary hover:underline text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            <PendingTasksList />
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  userName={task.userId === currentUser?.id ? currentUser?.name : partner?.name} 
                />
              ))
            ) : (
              <p className="text-gray-500">No tasks found</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Brownie Points</h2>
            <Link to="/history" className="text-primary hover:underline text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentBrowniePoints.length > 0 ? (
              recentBrowniePoints.map((point) => (
                <BrowniePointCard key={point.id} browniePoint={point} />
              ))
            ) : (
              <p className="text-gray-500">No brownie points found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

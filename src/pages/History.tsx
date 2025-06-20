
import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCard from '@/components/TaskCard';
import BrowniePointCard from '@/components/BrowniePointCard';
import BackToMainMenu from '@/components/BackToMainMenu';
import { format } from 'date-fns';
import { Task, BrowniePoint } from '@/types';

const History = () => {
  const { currentUser, partner, tasks, browniePoints } = useApp();
  const [mainTab, setMainTab] = useState<string>("tasks");
  const [taskFilterTab, setTaskFilterTab] = useState<string>("all");
  const [pointFilterTab, setPointFilterTab] = useState<string>("all");
  
  // Debug logs to see what's happening
  useEffect(() => {
    console.log("Current user in History:", currentUser);
    console.log("Partner in History:", partner);
    console.log("All tasks in History:", tasks);
    console.log("Current task filter tab:", taskFilterTab);
  }, [currentUser, partner, tasks, taskFilterTab]);
  
  // Group items by date for displaying in sections
  const groupByDate = (items: { timestamp?: Date, createdAt?: Date }[]) => {
    const groups: Record<string, typeof items> = {};
    
    items.forEach(item => {
      const date = item.timestamp || item.createdAt;
      if (date) {
        const dateStr = format(new Date(date), 'yyyy-MM-dd');
        if (!groups[dateStr]) {
          groups[dateStr] = [];
        }
        groups[dateStr].push(item);
      }
    });
    
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .map(([date, items]) => ({
        date,
        items,
      }));
  };

  // Filter and sort tasks
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Apply filtering based on task filter tab
  const filteredTasks = sortedTasks.filter(task => {
    if (taskFilterTab === "all") return true;
    if (taskFilterTab === "my-tasks" && currentUser) {
      console.log("Filtering for my tasks", task.userId, currentUser.id, task.userId === currentUser.id);
      return task.userId === currentUser.id;
    }
    if (taskFilterTab === "partner-tasks" && partner) {
      console.log("Filtering for partner tasks", task.userId, partner.id, task.userId === partner.id);
      return task.userId === partner.id;
    }
    return false;
  });
  
  console.log("Filtered tasks for current tab:", filteredTasks, "using filter:", taskFilterTab);
  
  const groupedTasks = groupByDate(filteredTasks);
  
  // Filter and sort brownie points
  const sortedBrowniePoints = [...browniePoints].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const filteredBrowniePoints = sortedBrowniePoints.filter(point => {
    if (pointFilterTab === "all") return true;
    if (pointFilterTab === "sent" && currentUser) return point.fromUserId === currentUser.id;
    if (pointFilterTab === "received" && currentUser) return point.toUserId === currentUser.id;
    return false;
  });
  
  const groupedBrowniePoints = groupByDate(filteredBrowniePoints);
  
  // Fix the tab selection issue - use actual Tabs component state
  return (
    <div className="container py-8">
      <div className="mb-4">
        <BackToMainMenu />
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">History</h1>
        <p className="text-gray-500">View your activity history and contributions</p>
      </div>
      
      <Tabs defaultValue="tasks" className="w-full" value={mainTab} onValueChange={setMainTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="tasks">Actions</TabsTrigger>
          <TabsTrigger value="browniePoints">Brownie Points</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-6">
          <Tabs value={taskFilterTab} onValueChange={setTaskFilterTab} className="w-full">
            <TabsList className="justify-start mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="my-tasks">Mine</TabsTrigger>
              <TabsTrigger value="partner-tasks">Partner's</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {filteredTasks.length > 0 ? (
            groupedTasks.map(({ date, items }) => (
              <div key={date} className="space-y-4">
                <h2 className="text-xl font-semibold sticky top-0 bg-white py-2 border-b">
                  {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((task: Task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task}
                      userName={task.userId === currentUser?.id ? currentUser?.name : partner?.name}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {taskFilterTab === "all" 
                  ? "No actions found yet. Try adding some actions!" 
                  : taskFilterTab === "my-tasks"
                    ? "You haven't completed any actions yet."
                    : "Your partner hasn't completed any actions yet."}
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="browniePoints" className="space-y-6">
          <Tabs value={pointFilterTab} onValueChange={setPointFilterTab} className="w-full">
            <TabsList className="justify-start">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {filteredBrowniePoints.length > 0 ? (
            groupedBrowniePoints.map(({ date, items }) => (
              <div key={date} className="space-y-4">
                <h2 className="text-xl font-semibold sticky top-0 bg-white py-2 border-b">
                  {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((point: BrowniePoint) => (
                    <BrowniePointCard key={point.id} browniePoint={point} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {pointFilterTab === "all" 
                  ? "No brownie points found yet." 
                  : pointFilterTab === "sent"
                    ? "You haven't sent any brownie points yet."
                    : "You haven't received any brownie points yet."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;

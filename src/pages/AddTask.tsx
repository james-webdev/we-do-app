
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { TaskRating, TaskType } from '@/types';
import { Slider } from '@/components/ui/slider';

const AddTask = () => {
  const navigate = useNavigate();
  const { currentUser, addNewTask } = useApp();
  
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState<TaskType>('mental');
  const [rating, setRating] = React.useState<TaskRating>(5);
  const [date, setDate] = React.useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [time, setTime] = React.useState<string>(
    new Date().toTimeString().split(' ')[0].substring(0, 5)
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    
    if (!currentUser) {
      toast.error('You must be logged in to add a task');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Combine date and time
      const timestamp = new Date(`${date}T${time}`);
      
      await addNewTask({
        title,
        type,
        rating,
        userId: currentUser.id,
        timestamp
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (value: number[]) => {
    setRating(value[0] as TaskRating);
  };
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Add New Task</h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>
            Record a parenting task you've completed (will be sent to your partner for approval)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="e.g., School pickup, Doctor appointment"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Task Type</Label>
              <RadioGroup
                value={type}
                onValueChange={(value) => setType(value as TaskType)}
                className="grid grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mental" id="mental" />
                  <Label htmlFor="mental" className="cursor-pointer">Mental</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="physical" id="physical" />
                  <Label htmlFor="physical" className="cursor-pointer">Physical</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both" className="cursor-pointer">Both</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Task Difficulty Rating: {rating}</Label>
                <Slider
                  id="rating"
                  min={1}
                  max={10}
                  step={1}
                  value={[rating]}
                  onValueChange={handleRatingChange}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500 px-1">
                  <span>Easy</span>
                  <span>Moderate</span>
                  <span>Challenging</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Rate the difficulty of this task from 1 (very easy) to 10 (extremely difficult)
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTask;

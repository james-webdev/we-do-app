
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { BrowniePointType } from '@/types';

const GiveBrowniePoint = () => {
  const navigate = useNavigate();
  const { currentUser, partner, summary, addNewBrowniePoint } = useApp();
  
  const [type, setType] = React.useState<BrowniePointType>('effort');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    if (!currentUser || !partner) {
      toast.error('Cannot find user information');
      return;
    }
    
    // Check if user has exceeded the weekly limit
    if (summary.browniePointsRemaining <= 0) {
      toast.error('You have used all of your Brownie Points for this week');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await addNewBrowniePoint({
        fromUserId: currentUser.id,
        toUserId: partner.id,
        type,
        message
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error sending brownie point:', error);
      toast.error('Failed to send Brownie Point');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Give a Brownie Point</h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Send Appreciation</CardTitle>
          <CardDescription>
            Send a Brownie Point to your partner (
            {summary?.browniePointsRemaining || 0} remaining this week)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Brownie Point Type</Label>
              <RadioGroup
                value={type}
                onValueChange={(value) => setType(value as BrowniePointType)}
                className="grid grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="time" id="time" />
                  <Label htmlFor="time" className="cursor-pointer">Time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="effort" id="effort" />
                  <Label htmlFor="effort" className="cursor-pointer">Effort</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fun" id="fun" />
                  <Label htmlFor="fun" className="cursor-pointer">Fun</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Express your appreciation..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="resize-none"
                required
              />
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
              <Button 
                type="submit" 
                disabled={isSubmitting || summary?.browniePointsRemaining <= 0}
              >
                {isSubmitting ? 'Sending...' : 'Send Brownie Point'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GiveBrowniePoint;

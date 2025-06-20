import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { Input } from '@/components/ui/input';
import { CakeIcon } from 'lucide-react';
import BackToMainMenu from '@/components/BackToMainMenu';

const GiveBrowniePoint = () => {
  const navigate = useNavigate();
  const { currentUser, partner, addNewBrowniePoint } = useApp();
  
  const [points, setPoints] = React.useState<number>(1);
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    if (!points || points < 1) {
      toast.error('Please enter at least 1 point');
      return;
    }
    
    if (!currentUser || !partner) {
      toast.error('Cannot find user information');
      return;
    }
    
    // No limit on brownie points
    
    try {
      setIsSubmitting(true);
      
      await addNewBrowniePoint({
        fromUserId: currentUser.id,
        toUserId: partner.id,
        type: 'custom', // Using 'custom' as the type for all points now
        message,
        points: points // Use the points from the input
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
      <div className="mb-4">
        <BackToMainMenu />
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Give a Brownie Point</h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Send Appreciation</CardTitle>
              <CardDescription>
                Send a Brownie Point to your partner
              </CardDescription>
            </div>
            <div className="w-64 h-64 flex items-center justify-center">
              <img 
                src="/brownie-icon.png" 
                alt="Delicious Brownie" 
                className="w-full h-full object-contain" 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="points">Brownie Points</Label>
              <div className="flex items-center">
                <Input
                  id="points"
                  type="number"
                  min="1"
                  value={points}
                  onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                  className="w-full"
                  required
                />
              </div>
              <p className="text-sm text-muted-foreground">
                How many points would you like to give?
              </p>
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
            
            <div className="flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-2 sm:space-y-0 pt-4">
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
                disabled={isSubmitting}
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

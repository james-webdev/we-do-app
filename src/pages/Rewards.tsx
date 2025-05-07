
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Gift, CircleDollarSign, Star, Plus } from 'lucide-react';
import { Reward } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

// Form schema for proposed rewards
const proposedRewardSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  pointsCost: z.coerce.number().min(1, "Points must be at least 1").max(100, "Points cannot exceed 100"),
  imageIcon: z.enum(['gift', 'award', 'star', 'circle-dollar-sign'])
});

type ProposedRewardFormValues = z.infer<typeof proposedRewardSchema>;

const Rewards = () => {
  const { rewards, availablePoints, isLoading, redeemReward, proposeReward, pendingRewards, approveReward, rejectReward } = useApp();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showProposeDialog, setShowProposeDialog] = useState(false);
  
  const form = useForm<ProposedRewardFormValues>({
    resolver: zodResolver(proposedRewardSchema),
    defaultValues: {
      title: '',
      description: '',
      pointsCost: 10,
      imageIcon: 'gift'
    }
  });

  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward);
  };
  
  const handleRedeemConfirm = async () => {
    if (!selectedReward) return;
    
    setIsRedeeming(true);
    const success = await redeemReward(selectedReward.id);
    setIsRedeeming(false);
    
    if (success) {
      setSelectedReward(null);
    }
  };
  
  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'gift':
        return <Gift className="w-10 h-10 text-purple-500" />;
      case 'award':
        return <Award className="w-10 h-10 text-yellow-500" />;
      case 'star':
        return <Star className="w-10 h-10 text-blue-500" />;
      case 'circle-dollar-sign':
        return <CircleDollarSign className="w-10 h-10 text-green-500" />;
      default:
        return <Gift className="w-10 h-10 text-purple-500" />;
    }
  };

  const onSubmitProposal = async (data: ProposedRewardFormValues) => {
    try {
      await proposeReward({
        ...data,
        id: '', // Will be set by the server
        status: 'pending',
        createdById: '', // Will be set by the server
      });

      setShowProposeDialog(false);
      form.reset();
      toast.success("Reward proposal submitted for partner approval");
    } catch (error) {
      toast.error("Failed to propose reward");
      console.error(error);
    }
  };
  
  // Updated rewards with higher point costs
  const updatedRewards = [
    {
      id: '1',
      title: 'Dinner Out',
      description: 'Partner cooks dinner of your choice',
      pointsCost: 20,
      imageIcon: 'gift'
    },
    {
      id: '2',
      title: 'Movie Night',
      description: 'Your choice of movie plus snacks',
      pointsCost: 10,
      imageIcon: 'star'
    },
    {
      id: '3',
      title: 'Sleep In',
      description: 'Partner takes morning duties',
      pointsCost: 15,
      imageIcon: 'circle-dollar-sign'
    },
    {
      id: '4',
      title: 'Day Off',
      description: 'Partner handles all tasks for a full day',
      pointsCost: 30,
      imageIcon: 'award'
    }
  ];
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Rewards</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Rewards</h1>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setShowProposeDialog(true)}
            className="flex items-center gap-1"
            variant="outline"
          >
            <Plus size={16} />
            Propose Reward
          </Button>
          <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-lg font-medium flex items-center">
            <Award className="mr-2" />
            {availablePoints} {availablePoints === 1 ? 'point' : 'points'} available
          </div>
        </div>
      </div>
      
      {pendingRewards && pendingRewards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Rewards Pending Your Approval</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRewards.map((reward) => (
              <Card key={reward.id} className="overflow-hidden hover:shadow-md transition-shadow border-amber-200 bg-amber-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {getRewardIcon(reward.imageIcon)}
                    <div>
                      <h2 className="text-xl font-semibold">{reward.title}</h2>
                      <div className="flex items-center text-amber-600 font-medium">
                        <Award size={16} className="mr-1" />
                        {reward.pointsCost} {reward.pointsCost === 1 ? 'point' : 'points'}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{reward.description}</p>
                  <div className="flex gap-2">
                    <Button 
                      className="w-1/2" 
                      variant="outline"
                      onClick={() => rejectReward(reward.id)}
                    >
                      Reject
                    </Button>
                    <Button 
                      className="w-1/2" 
                      onClick={() => approveReward(reward.id)}
                    >
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {updatedRewards.map((reward) => (
          <Card key={reward.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                {getRewardIcon(reward.imageIcon)}
                <div>
                  <h2 className="text-xl font-semibold">{reward.title}</h2>
                  <div className="flex items-center text-amber-600 font-medium">
                    <Award size={16} className="mr-1" />
                    {reward.pointsCost} {reward.pointsCost === 1 ? 'point' : 'points'}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6">{reward.description}</p>
              <Button 
                className="w-full" 
                onClick={() => handleRedeemClick(reward)}
                disabled={availablePoints < reward.pointsCost}
              >
                {availablePoints < reward.pointsCost 
                  ? `Need ${reward.pointsCost - availablePoints} more points` 
                  : 'Redeem Reward'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Redeem Reward Dialog */}
      <Dialog open={!!selectedReward} onOpenChange={(open) => !open && setSelectedReward(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem Reward</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem {selectedReward?.title} for {selectedReward?.pointsCost} points?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">{selectedReward?.description}</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedReward(null)}
              disabled={isRedeeming}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRedeemConfirm}
              disabled={isRedeeming}
            >
              {isRedeeming ? 'Redeeming...' : 'Confirm Redemption'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Propose Reward Dialog */}
      <Dialog open={showProposeDialog} onOpenChange={setShowProposeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Propose New Reward</DialogTitle>
            <DialogDescription>
              Create a custom reward that your partner needs to approve.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitProposal)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Movie Night" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Your choice of movie plus snacks" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pointsCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Point Cost</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageIcon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <select
                        className="w-full border rounded p-2"
                        {...field}
                      >
                        <option value="gift">Gift</option>
                        <option value="award">Award</option>
                        <option value="star">Star</option>
                        <option value="circle-dollar-sign">Money</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowProposeDialog(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Propose Reward</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rewards;

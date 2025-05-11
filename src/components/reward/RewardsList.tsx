import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RewardCard } from '@/components/reward/RewardCard';
import { Reward } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CircleDollarSign } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { CreateRewardForm } from './CreateRewardForm';

export function RewardsList() {
  const { rewards, deleteReward, redeemReward, availablePoints } = useApp();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Reward | null>(null);
  const [showRedeemConfirm, setShowRedeemConfirm] = useState<Reward | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Handle reward deletion
  const handleDeleteClick = (reward: Reward) => {
    setShowDeleteConfirm(reward);
  };
  
  const handleDeleteConfirm = async () => {
    if (!showDeleteConfirm) return;
    
    try {
      const success = await deleteReward(showDeleteConfirm.id);
      
      if (success) {
        setShowDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting reward:', error);
    }
  };
  
  // Handle reward redemption
  const handleRedeemClick = (reward: Reward) => {
    setShowRedeemConfirm(reward);
  };
  
  const handleRedeemConfirm = async () => {
    if (!showRedeemConfirm) return;
    
    try {
      const success = await redeemReward(showRedeemConfirm.id);
      
      if (success) {
        setShowRedeemConfirm(null);
        
        // Trigger confetti explosion
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        // Fire another burst for more effect
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0.1, y: 0.6 }
          });
        }, 250);
        
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 0.9, y: 0.6 }
          });
        }, 400);
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Rewards</h2>
          <div className="flex items-center mt-1 text-amber-600">
            <CircleDollarSign className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{availablePoints} points available</span>
          </div>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>Create Reward</Button>
      </div>
      
      <Alert variant="default" className="bg-primary/10 border-primary/20">
        <AlertCircle className="h-4 w-4 mr-2 text-primary" />
        <AlertDescription>
          Redeem rewards using your brownie points. Both partners can create and delete rewards.
        </AlertDescription>
      </Alert>
      
      {rewards.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No rewards available. Create your first reward!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              onRedeemClick={handleRedeemClick}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      )}
      
      {/* Delete confirmation dialog */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={(open) => !open && setShowDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reward</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this reward? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {showDeleteConfirm && (
              <div className="font-medium">{showDeleteConfirm.title}</div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Redeem confirmation dialog */}
      <Dialog open={!!showRedeemConfirm} onOpenChange={(open) => !open && setShowRedeemConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem Reward</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem this reward? This will use {showRedeemConfirm?.pointsCost} brownie points.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {showRedeemConfirm && (
              <div className="font-medium">{showRedeemConfirm.title}</div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRedeemConfirm(null)}>Cancel</Button>
            <Button onClick={handleRedeemConfirm}>Redeem</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create reward dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Reward</DialogTitle>
            <DialogDescription>
              Create a new reward that both you and your partner can redeem.
            </DialogDescription>
          </DialogHeader>
          <CreateRewardForm onSuccess={() => setShowCreateForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Gift,
  Star,
  CircleDollarSign,
  Award,
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface CreateRewardFormProps {
  onSuccess: () => void;
}

const iconOptions = [
  { value: 'gift', label: 'Gift', icon: Gift },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'circle-dollar-sign', label: 'Dollar', icon: CircleDollarSign },
  { value: 'award', label: 'Award', icon: Award },
];

export function CreateRewardForm({ onSuccess }: CreateRewardFormProps) {
  const { proposeReward } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pointsCost: 3,
    imageIcon: 'gift',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pointsCost' ? parseInt(value) || 0 : value,
    }));
  };

  const handleIconChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      imageIcon: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title for the reward');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Please enter a description for the reward');
      return;
    }
    
    if (formData.pointsCost < 1) {
      toast.error('Points cost must be at least 1');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await proposeReward(formData);
      
      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating reward:', error);
      toast.error('Failed to create reward');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Weekend Time Off"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe what this reward entails..."
          required
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pointsCost">Points Cost</Label>
          <Input
            id="pointsCost"
            name="pointsCost"
            type="number"
            min={1}
            max={100}
            value={formData.pointsCost}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="imageIcon">Icon</Label>
          <Select value={formData.imageIcon} onValueChange={handleIconChange}>
            <SelectTrigger id="imageIcon">
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <option.icon className="h-4 w-4 mr-2" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Reward'}
        </Button>
      </div>
    </form>
  );
}


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupAuth = async () => {
      setLoading(true);
      
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          // Use setTimeout to avoid potential recursion issues
          setTimeout(() => {
            console.log("Auth state changed:", session ? "logged in" : "logged out");
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          }, 0);
        });
  
        // THEN check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Got existing session:", session ? "found" : "none");
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
  
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth setup error:", error);
        setLoading(false);
      }
    };

    setupAuth();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Successfully signed in');
      navigate('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Step 1: Sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) throw error;
      
      // Step 2: If signup succeeded but we don't have a user yet (email confirmation required)
      // We'll create the profile manually later when they confirm their email
      if (!data.user) {
        toast.success("Account created! Please check your email for verification.");
        navigate('/signin');
        return;
      }
      
      // Step 3: If we have a user (email confirmation not required), create the profile
      if (data.user) {
        // Wait a moment to ensure the user is fully created in auth.users
        // This helps prevent the foreign key constraint error
        setTimeout(async () => {
          try {
            const { error: profileError } = await supabase.rpc('create_new_profile', {
              user_id: data.user!.id,
              user_name: name,
              user_email: email
            });
            
            if (profileError) {
              console.error('Profile creation error:', profileError);
              toast.error('Profile setup encountered an issue. Please contact support.');
            } else {
              toast.success("Account created successfully!");
              
              // If email confirmation is not required, sign in the user directly
              if (data.session) {
                setSession(data.session);
                setUser(data.user);
                navigate('/');
              } else {
                navigate('/signin');
              }
            }
          } catch (profileError: any) {
            console.error('Profile creation error:', profileError);
            toast.error('Account created but profile setup failed. Please sign in to retry.');
          }
        }, 1000); // Add a delay to ensure auth.users is updated first
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Successfully signed out');
      navigate('/signin');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

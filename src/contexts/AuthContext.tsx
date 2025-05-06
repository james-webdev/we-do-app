
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
      const { data, error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      if (data.user) {
        try {
          // Use RPC function to create profile to bypass RLS
          const { error: profileError } = await supabase.rpc('create_new_profile', {
            user_id: data.user.id,
            user_name: name,
            user_email: email
          } as any); // Cast to any to bypass TypeScript error
          
          if (profileError) throw profileError;

          toast.success("Account created! Please check your email for verification.");
        } catch (profileError: any) {
          console.error('Profile creation error:', profileError);
          toast.error('Account created but profile setup failed: ' + profileError.message);
        }
      }
      
      // Navigate to signin page after successful signup
      navigate('/signin');
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

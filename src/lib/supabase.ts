
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/integrations/supabase/types'

// Use the explicit Supabase URL and key from the Supabase client.ts
const supabaseUrl = "https://rvxlgmkcmdtkceabvqic.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2eGxnbWtjbWR0a2NlYWJ2cWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NTc2NTgsImV4cCI6MjA2MjEzMzY1OH0.7LLeoApApavYP2ahh6pVmGLRmfWdl4FcUvG84s4pJ98"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
})

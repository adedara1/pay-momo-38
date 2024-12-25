import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kyjnthjhkppjrnegkfio.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5am50aGpoa3BwanJuZWdrZmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NjAzMTgsImV4cCI6MjA1MDUzNjMxOH0._OrdUTDq-kDmp9Asot5VjDvu4ssayVSC5sR9dvJkavI";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    },
  }
);

// Log pour le debugging
supabase.from('transactions').select('*')
  .then(response => {
    console.log('Supabase connection test:', response);
  })
  .catch(error => {
    console.error('Supabase connection error:', error);
  });
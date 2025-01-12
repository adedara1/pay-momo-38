import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const SUPABASE_URL = "https://yzllbqwmaanbtrpcwhji.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bGxicXdtYWFuYnRycGN3aGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MTY2NjMsImV4cCI6MjA1MjA5MjY2M30.1mufq7q2krbgaP94-poYfNSlsa6vDirEuNCnIWLQ0qc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
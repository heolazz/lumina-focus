import { createClient } from '@supabase/supabase-js';

// GANTI INI DENGAN DATA DARI SUPABASE DASHBOARD ANDA
const supabaseUrl = 'https://yqzinndqwvhmhokxnqyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxemlubmRxd3ZobWhva3hucXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MjE5NDcsImV4cCI6MjA4NDQ5Nzk0N30.3cyRl470d_YyPgyV_OrLFOHeCIi-GtruOhCb07oqUCw';

export const supabase = createClient(supabaseUrl, supabaseKey);
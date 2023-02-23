import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://urkohljbvlibwnxvmguo.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVya29obGpidmxpYndueHZtZ3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY4MjQwNjksImV4cCI6MTk5MjQwMDA2OX0.YZIdr1y_uwD9oZtR4UNLcOh7lTbSUW_etVhbglzLZ8c';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

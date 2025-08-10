// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace with your own Supabase project URL and anon key
const SUPABASE_URL = 'https://qhsfxcesuhbpvhquuzod.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoc2Z4Y2VzdWhicHVocXV1em9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNzcxNjQsImV4cCI6MjA2NzY1MzE2NH0.fS-T2lJGSpc8OWrOADjrpg8E-ZwX0AcBVxBxnrJ0KbY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;

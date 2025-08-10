// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qhsfxcesuhbpvhquuzod.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoc2Z4Y2VzdWhicHZocXV1em9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNzcxNjQsImV4cCI6MjA2NzY1MzE2NH0.fS-T2lJGSpc8OWrOADjrpg8E-ZwX0AcBVxBxnrJ0KbY'; // Double-check your anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;

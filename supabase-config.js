const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://nhmgolhyebehkmvlutir.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obWdvbGh5ZWJlaGttdmx1dGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzQsImV4cCI6MjA1MDU0ODk3NH0.YOUR_ANON_KEY'; // You'll need to replace this with your actual anon key

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Database connection string for direct PostgreSQL access
const dbConnectionString = 'postgresql://postgres:aass1122@db.nhmgolhyebehkmvlutir.supabase.co:5432/postgres';

module.exports = {
  supabase,
  supabaseUrl,
  supabaseKey,
  dbConnectionString
};

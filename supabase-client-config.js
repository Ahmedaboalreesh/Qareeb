// Supabase Client Configuration
// This file contains the Supabase configuration for client-side usage

// Supabase configuration
const supabaseConfig = {
    url: 'https://nhmgolhyebehkmvlutir.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obWdvbGh5ZWJlaGttdmx1dGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzQsImV4cCI6MjA1MDU0ODk3NH0.YOUR_ANON_KEY' // You'll need to replace this with your actual anon key
};

// Initialize Supabase for client-side
if (typeof window !== 'undefined') {
    // Load Supabase from CDN if not already loaded
    if (!window.supabase) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = function() {
            window.supabase = window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey);
            console.log('✅ Supabase client loaded from CDN');
        };
        document.head.appendChild(script);
    }
}

module.exports = { supabaseConfig };

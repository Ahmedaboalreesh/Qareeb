// Supabase Configuration for Qareeb Car Rental Platform
// This file contains the Supabase client configuration

const SUPABASE_CONFIG = {
    // Supabase Project Configuration
    url: 'https://nhmgolhyebehkmvlutir.supabase.co',
    anonKey: 'your-anon-key-here', // Replace with your actual anon key
    serviceRoleKey: 'your-service-role-key-here', // Replace with your actual service role key
    
    // Database Configuration
    database: {
        host: 'db.nhmgolhyebehkmvlutir.supabase.co',
        port: 5432,
        database: 'postgres',
        username: 'postgres',
        password: 'Ahmed@2006',
        connectionString: 'postgresql://postgres:Ahmed@2006@db.nhmgolhyebehkmvlutir.supabase.co:5432/postgres'
    },
    
    // Storage Configuration
    storage: {
        bucket: 'car-photos',
        publicUrl: 'https://nhmgolhyebehkmvlutir.supabase.co/storage/v1/object/public'
    },
    
    // Authentication Configuration
    auth: {
        redirectTo: window.location.origin,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    
    // Real-time Configuration
    realtime: {
        enabled: true,
        heartbeatIntervalMs: 30000,
        reconnectAfterMs: 5000
    }
};

// Initialize Supabase Client
let supabaseClient = null;

function initializeSupabase() {
    try {
        if (typeof supabase !== 'undefined') {
            supabaseClient = supabase.createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey,
                {
                    auth: SUPABASE_CONFIG.auth,
                    realtime: SUPABASE_CONFIG.realtime
                }
            );
            
            console.log('🔵 Supabase client initialized successfully');
            return supabaseClient;
        } else {
            console.warn('⚠️ Supabase SDK not loaded');
            return null;
        }
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        return null;
    }
}

// Get Supabase client instance
function getSupabaseClient() {
    if (!supabaseClient) {
        supabaseClient = initializeSupabase();
    }
    return supabaseClient;
}

// Export configuration and client
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.getSupabaseClient = getSupabaseClient;

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSupabase();
});

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPABASE_CONFIG,
        initializeSupabase,
        getSupabaseClient
    };
}
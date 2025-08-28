const { supabase } = require('../supabase-config');

async function initializeSupabase() {
    try {
        console.log('🔥 Initializing Supabase Database...');

        // Test connection
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (error) {
            console.error('❌ Supabase connection test failed:', error);
            throw error;
        }

        console.log('✅ Supabase connection test successful');

        // Create tables if they don't exist (Supabase handles this automatically via migrations)
        // But we can verify the tables exist
        const tables = ['users', 'cars', 'bookings', 'car_photos', 'notifications'];
        
        for (const table of tables) {
            try {
                const { error: tableError } = await supabase
                    .from(table)
                    .select('*')
                    .limit(1);
                
                if (tableError) {
                    console.warn(`⚠️ Table ${table} might not exist:`, tableError.message);
                } else {
                    console.log(`✅ Table ${table} is accessible`);
                }
            } catch (err) {
                console.warn(`⚠️ Could not verify table ${table}:`, err.message);
            }
        }

        console.log('✅ Supabase database initialized successfully!');
        console.log('📊 Database URL: https://nhmgolhyebehkmvlutir.supabase.co');
        console.log('🔗 Connection String: postgresql://postgres:aass1122@db.nhmgolhyebehkmvlutir.supabase.co:5432/postgres');

    } catch (error) {
        console.error('❌ Error initializing Supabase:', error);
        throw error;
    }
}

// Run initialization if this file is executed directly
if (require.main === module) {
    initializeSupabase()
        .then(() => {
            console.log('🎉 Supabase initialization completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Supabase initialization failed:', error);
            process.exit(1);
        });
}

module.exports = { initializeSupabase };

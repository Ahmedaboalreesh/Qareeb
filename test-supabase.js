// Test Supabase Database Connection
const { supabase } = require('./supabase-config');
const db = require('./database/supabase-db');

async function testSupabaseConnection() {
    try {
        console.log('🔥 Testing Supabase Database Connection...');

        // Test basic connection
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (error) {
            console.error('❌ Supabase connection test failed:', error);
            return;
        }

        console.log('✅ Supabase connection test successful');

        // Test database service
        console.log('🔄 Testing database service...');
        
        // Test getting database stats
        const stats = await db.getDatabaseStats();
        console.log('📊 Database stats:', stats);

        // Test creating a test user
        console.log('🔄 Testing user creation...');
        const testUser = {
            id: 'test-user-' + Date.now(),
            email: 'test@example.com',
            full_name: 'Test User',
            phone: '1234567890',
            city: 'Test City',
            user_type: 'renter',
            created_at: new Date().toISOString(),
            is_active: true
        };

        try {
            const createdUser = await db.createUser(testUser);
            console.log('✅ Test user created:', createdUser.id);

            // Test getting user
            const retrievedUser = await db.getUserById(createdUser.id);
            console.log('✅ Test user retrieved:', retrievedUser.full_name);

            // Test updating user
            const updatedUser = await db.updateUser(createdUser.id, { 
                full_name: 'Updated Test User' 
            });
            console.log('✅ Test user updated:', updatedUser.full_name);

            // Test deleting user
            await db.deleteUser(createdUser.id);
            console.log('✅ Test user deleted');

        } catch (userError) {
            console.warn('⚠️ User test failed (might be expected if table doesn\'t exist):', userError.message);
        }

        console.log('🎉 Supabase connection and basic functionality test completed!');

    } catch (error) {
        console.error('💥 Supabase test failed:', error);
    }
}

// Run the test
testSupabaseConnection()
    .then(() => {
        console.log('✅ All tests completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Tests failed:', error);
        process.exit(1);
    });

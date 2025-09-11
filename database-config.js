// Database Configuration for Qareeb Car Rental Platform
// This file contains the database connection settings

const databaseConfig = {
    // Supabase Configuration
    supabase: {
        url: 'https://nhmgolhyebehkmvlutir.supabase.co',
        anonKey: 'your-anon-key-here', // Replace with your actual anon key
        serviceRoleKey: 'your-service-role-key-here' // Replace with your actual service role key
    },
    
    // PostgreSQL Direct Connection
    postgres: {
        connectionString: 'postgresql://postgres:Ahmed@2006@db.nhmgolhyebehkmvlutir.supabase.co:5432/postgres',
        host: 'db.nhmgolhyebehkmvlutir.supabase.co',
        port: 5432,
        database: 'postgres',
        username: 'postgres',
        password: 'Ahmed@2006',
        ssl: {
            rejectUnauthorized: false
        }
    },
    
    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development'
    }
};

module.exports = databaseConfig;

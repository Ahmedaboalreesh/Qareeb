# Database Setup Guide for Qareeb Car Rental Platform

## ✅ Database Connection Configured

Your PostgreSQL database has been successfully configured with the following connection details:

```
postgresql://postgres:Ahmed@2006@db.nhmgolhyebehkmvlutir.supabase.co:5432/postgres
```

## 📁 Files Updated

The following files have been updated with your new database credentials:

1. **`supabase-config.js`** - Main Supabase configuration
2. **`database/supabase-init.js`** - Database initialization script
3. **`test-supabase.js`** - Database connection test
4. **`env.supabase.example`** - Environment variables template
5. **`database-config.js`** - New centralized database configuration

## 🚀 Next Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Test Database Connection
```bash
node test-supabase.js
```

### 3. Initialize Database Tables
```bash
node database/supabase-init.js
```

### 4. Start the Application
```bash
node server.js
```

## 🔧 Configuration Details

### Supabase URL
- **URL**: `https://nhmgolhyebehkmvlutir.supabase.co`
- **Database**: `postgres`
- **Host**: `db.nhmgolhyebehkmvlutir.supabase.co`
- **Port**: `5432`
- **Username**: `postgres`
- **Password**: `Ahmed@2006`

### Required Environment Variables
Create a `.env` file with the following variables:
```
SUPABASE_URL=https://nhmgolhyebehkmvlutir.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
DATABASE_URL=postgresql://postgres:Ahmed@2006@db.nhmgolhyebehkmvlutir.supabase.co:5432/postgres
```

## 📊 Database Schema

The database will be initialized with the following tables:
- **profiles** - User profiles and information
- **cars** - Car listings and details
- **car_photos** - Car images and photos
- **bookings** - Rental bookings and reservations
- **notifications** - User notifications
- **reviews** - Car reviews and ratings
- **payments** - Payment transactions

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Proper authentication policies
- SSL connection required
- User-specific data access controls

## 🛠️ Troubleshooting

### Connection Issues
1. Verify your Supabase project is active
2. Check if the database credentials are correct
3. Ensure your IP is whitelisted in Supabase
4. Verify SSL settings are properly configured

### Missing Dependencies
```bash
npm install @supabase/supabase-js pg
```

### Permission Issues
Make sure your Supabase service role key has the necessary permissions.

## 📞 Support

If you encounter any issues:
1. Check the Supabase dashboard for connection status
2. Review the error logs in the console
3. Verify all environment variables are set correctly
4. Test the connection using the provided test script

---

**Status**: ✅ Database connection configured and ready for use!

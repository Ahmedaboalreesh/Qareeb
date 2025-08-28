# Firebase to Supabase Migration Guide

This guide will help you migrate your car rental platform from Firebase to Supabase.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 2. Set Up Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project URL and anon key from the project settings
3. Update the configuration in `supabase-config.js`

### 3. Run Database Migration
```bash
# Run the SQL migration in your Supabase SQL editor
# Copy and paste the contents of database/supabase-migration.sql
```

### 4. Test the Connection
```bash
npm run test-supabase
```

## 📁 New Files Created

### Configuration Files
- `supabase-config.js` - Server-side Supabase configuration
- `supabase-client-config.js` - Client-side Supabase configuration

### Service Files
- `supabase-service.js` - Main Supabase service (replaces firebase-service.js)
- `database/supabase-db.js` - Database service (replaces firebase-db.js)
- `database/supabase-init.js` - Database initialization (replaces firebase-init.js)

### Migration Files
- `database/supabase-migration.sql` - SQL schema migration
- `test-supabase.js` - Connection test script

## 🔧 Configuration Updates

### Update supabase-config.js
Replace the placeholder values with your actual Supabase credentials:

```javascript
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseKey = 'your-actual-anon-key';
```

### Update supabase-client-config.js
Update the client configuration with your actual credentials:

```javascript
const supabaseConfig = {
    url: 'https://your-project-id.supabase.co',
    anonKey: 'your-actual-anon-key'
};
```

## 📊 Database Schema

The migration creates the following tables:

### Core Tables
- `users` - User profiles and authentication data
- `cars` - Car listings with owner information
- `bookings` - Rental bookings and reservations
- `car_photos` - Car image references
- `notifications` - User notifications
- `reviews` - User reviews and ratings
- `payments` - Payment transaction records

### Features
- UUID primary keys for better security
- Foreign key constraints for data integrity
- Row Level Security (RLS) policies for access control
- Automatic timestamp updates
- Indexes for optimal performance

## 🔄 API Changes

### Authentication
- Firebase Auth → Supabase Auth
- Same methods: `signUp`, `signInWithPassword`, `signOut`
- Real-time auth state changes

### Database Operations
- Firebase Realtime Database → Supabase PostgreSQL
- CRUD operations remain similar
- Real-time subscriptions via PostgreSQL changes

### Storage
- Firebase Storage → Supabase Storage
- Same file upload/download operations
- Public URL generation

## 🛠️ Code Migration Steps

### 1. Update Service Imports
Replace Firebase service imports with Supabase:

```javascript
// Old
import { firebaseService } from './firebase-service.js';

// New
import { supabaseService } from './supabase-service.js';
```

### 2. Update Authentication
```javascript
// Old Firebase
const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

// New Supabase
const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
});
```

### 3. Update Database Operations
```javascript
// Old Firebase
const snapshot = await firebase.database().ref('users').once('value');

// New Supabase
const { data, error } = await supabase
    .from('users')
    .select('*');
```

### 4. Update Real-time Listeners
```javascript
// Old Firebase
firebase.database().ref('users').on('value', callback);

// New Supabase
supabase
    .channel('users')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, callback)
    .subscribe();
```

## 🔐 Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Car owners can only modify their own cars
- Booking participants can only view their bookings
- Public read access for car listings

### Authentication
- JWT-based authentication
- Secure session management
- Password hashing with bcrypt

## 📈 Performance Optimizations

### Database Indexes
- Email lookups for users
- Owner-based car queries
- Status-based filtering
- Date range queries for bookings

### Storage Optimization
- Efficient file uploads
- Public URL caching
- Automatic file cleanup

## 🧪 Testing

### Run Connection Test
```bash
npm run test-supabase
```

### Test Database Operations
```bash
node test-supabase.js
```

### Verify Real-time Features
- Test auth state changes
- Test database subscriptions
- Test file uploads

## 🚨 Important Notes

### 1. Data Migration
- Export existing Firebase data
- Transform data to match new schema
- Import into Supabase tables

### 2. Environment Variables
- Update `.env` file with Supabase credentials
- Remove Firebase environment variables

### 3. Client-side Updates
- Update HTML files to load Supabase client
- Replace Firebase SDK with Supabase SDK
- Update all service calls

### 4. Storage Migration
- Download files from Firebase Storage
- Upload to Supabase Storage
- Update file references in database

## 🔍 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Verify Supabase URL and key
   - Check network connectivity
   - Ensure project is active

2. **Authentication Errors**
   - Verify email/password format
   - Check user exists in Supabase
   - Ensure auth is enabled

3. **Permission Denied**
   - Check RLS policies
   - Verify user authentication
   - Review table permissions

4. **Real-time Not Working**
   - Check subscription setup
   - Verify channel configuration
   - Ensure database changes trigger events

### Debug Commands
```bash
# Test database connection
npm run test-supabase

# Check database stats
node -e "require('./database/supabase-db').getDatabaseStats().then(console.log)"

# Clear all data (for testing)
node -e "require('./database/supabase-db').clearAllData().then(console.log)"
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

## 🎉 Migration Complete!

After following this guide, your car rental platform will be fully migrated from Firebase to Supabase with:

- ✅ PostgreSQL database with full SQL capabilities
- ✅ Real-time subscriptions
- ✅ Row Level Security
- ✅ File storage
- ✅ Authentication
- ✅ Better performance and scalability

For support or questions, refer to the Supabase documentation or community forums.

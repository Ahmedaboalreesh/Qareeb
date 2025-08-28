// Supabase Service - Main Database Service for Car Rental Platform
// This service replaces Firebase and handles all data operations

class SupabaseService {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.init();
    }

    // Initialize Supabase
    async init() {
        try {
            // Check if Supabase is available
            if (typeof window !== 'undefined' && window.supabase) {
                this.supabase = window.supabase;
            } else {
                // For server-side usage, we'll need to import the config
                const { supabase } = await import('./supabase-config.js');
                this.supabase = supabase;
            }

            console.log('🔥 Supabase Service initialized successfully');
            
            // Set up auth state listener
            this.supabase.auth.onAuthStateChange((event, session) => {
                this.currentUser = session?.user || null;
                console.log('Auth state changed:', event, this.currentUser ? 'User logged in' : 'User logged out');
            });

        } catch (error) {
            console.error('❌ Supabase initialization failed:', error);
            throw error;
        }
    }

    // ==================== AUTHENTICATION ====================

    // Register new user
    async registerUser(userData) {
        try {
            console.log('🔄 Starting user registration for:', userData.email);
            
            // Validate required fields
            if (!userData.email || !userData.password || !userData.full_name) {
                throw new Error('Missing required fields: email, password, or full_name');
            }

            // Create Supabase Auth user
            console.log('🔄 Creating Supabase Auth user...');
            const { data: authData, error: authError } = await this.supabase.auth.signUp({
                email: userData.email,
                password: userData.password
            });

            if (authError) {
                throw authError;
            }

            const user = authData.user;
            console.log('✅ Supabase Auth user created:', user.id);

            // Store additional user data in database
            const userProfile = {
                id: user.id,
                email: userData.email,
                full_name: userData.full_name,
                phone: userData.phone || '',
                city: userData.city || '',
                user_type: userData.user_type || 'renter', // 'renter' or 'owner'
                created_at: new Date().toISOString(),
                is_active: true,
                profile_photo: userData.profile_photo || null,
                newsletter: userData.newsletter || false
            };

            console.log('🔄 Saving user profile to database...');
            const { error: profileError } = await this.supabase
                .from('users')
                .insert([userProfile]);

            if (profileError) {
                throw profileError;
            }

            console.log('✅ User profile saved to database');
            console.log('✅ User registered successfully:', user.id);
            return { user, profile: userProfile };

        } catch (error) {
            console.error('❌ Registration failed:', error);
            throw error;
        }
    }

    // Login user
    async loginUser(email, password) {
        try {
            const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (authError) {
                throw authError;
            }

            const user = authData.user;

            // Get user profile from database
            const { data: profile, error: profileError } = await this.supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError || !profile) {
                throw new Error('User profile not found');
            }

            console.log('✅ User logged in successfully:', user.id);
            return { user, profile };

        } catch (error) {
            console.error('❌ Login failed:', error);
            throw error;
        }
    }

    // Logout user
    async logoutUser() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) {
                throw error;
            }
            this.currentUser = null;
            console.log('✅ User logged out successfully');
        } catch (error) {
            console.error('❌ Logout failed:', error);
            throw error;
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get current user profile
    async getCurrentUserProfile() {
        if (!this.currentUser) {
            return null;
        }

        try {
            const { data: profile, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) {
                throw error;
            }

            return profile;
        } catch (error) {
            console.error('❌ Error getting user profile:', error);
            throw error;
        }
    }

    // Update user profile
    async updateUserProfile(updates) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const { error } = await this.supabase
                .from('users')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', this.currentUser.id);

            if (error) {
                throw error;
            }

            console.log('✅ User profile updated successfully');
        } catch (error) {
            console.error('❌ Error updating user profile:', error);
            throw error;
        }
    }

    // ==================== CARS MANAGEMENT ====================

    // Create new car
    async createCar(carData) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const car = {
                owner_id: this.currentUser.id,
                ...carData,
                created_at: new Date().toISOString(),
                is_available: true,
                status: 'active'
            };

            const { data, error } = await this.supabase
                .from('cars')
                .insert([car])
                .select()
                .single();

            if (error) {
                throw error;
            }

            console.log('✅ Car created successfully:', data.id);
            return data;

        } catch (error) {
            console.error('❌ Error creating car:', error);
            throw error;
        }
    }

    // Get all cars
    async getAllCars() {
        try {
            const { data: cars, error } = await this.supabase
                .from('cars')
                .select('*');

            if (error) {
                throw error;
            }

            return cars || [];

        } catch (error) {
            console.error('❌ Error getting cars:', error);
            throw error;
        }
    }

    // Get cars by owner
    async getCarsByOwner(ownerId = null) {
        try {
            const userId = ownerId || this.currentUser?.id;
            if (!userId) {
                throw new Error('No user ID provided');
            }

            const { data: cars, error } = await this.supabase
                .from('cars')
                .select('*')
                .eq('owner_id', userId);

            if (error) {
                throw error;
            }

            return cars || [];

        } catch (error) {
            console.error('❌ Error getting cars by owner:', error);
            throw error;
        }
    }

    // Get car by ID
    async getCarById(carId) {
        try {
            const { data: car, error } = await this.supabase
                .from('cars')
                .select('*')
                .eq('id', carId)
                .single();

            if (error) {
                throw error;
            }

            return car;

        } catch (error) {
            console.error('❌ Error getting car:', error);
            throw error;
        }
    }

    // Update car
    async updateCar(carId, updates) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const { error } = await this.supabase
                .from('cars')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', carId);

            if (error) {
                throw error;
            }

            console.log('✅ Car updated successfully:', carId);

        } catch (error) {
            console.error('❌ Error updating car:', error);
            throw error;
        }
    }

    // Delete car
    async deleteCar(carId) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const { error } = await this.supabase
                .from('cars')
                .delete()
                .eq('id', carId);

            if (error) {
                throw error;
            }

            console.log('✅ Car deleted successfully:', carId);

        } catch (error) {
            console.error('❌ Error deleting car:', error);
            throw error;
        }
    }

    // ==================== BOOKINGS MANAGEMENT ====================

    // Create new booking
    async createBooking(bookingData) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const booking = {
                renter_id: this.currentUser.id,
                ...bookingData,
                created_at: new Date().toISOString(),
                status: 'pending'
            };

            const { data, error } = await this.supabase
                .from('bookings')
                .insert([booking])
                .select()
                .single();

            if (error) {
                throw error;
            }

            console.log('✅ Booking created successfully:', data.id);
            return data;

        } catch (error) {
            console.error('❌ Error creating booking:', error);
            throw error;
        }
    }

    // Get bookings by user
    async getBookingsByUser(userType = 'renter') {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const queryField = userType === 'owner' ? 'owner_id' : 'renter_id';
            const { data: bookings, error } = await this.supabase
                .from('bookings')
                .select('*')
                .eq(queryField, this.currentUser.id);

            if (error) {
                throw error;
            }

            return bookings || [];

        } catch (error) {
            console.error('❌ Error getting bookings:', error);
            throw error;
        }
    }

    // Update booking status
    async updateBookingStatus(bookingId, status) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const { error } = await this.supabase
                .from('bookings')
                .update({
                    status: status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', bookingId);

            if (error) {
                throw error;
            }

            console.log('✅ Booking status updated:', bookingId, status);

        } catch (error) {
            console.error('❌ Error updating booking status:', error);
            throw error;
        }
    }

    // ==================== PHOTOS MANAGEMENT ====================

    // Upload car photo
    async uploadCarPhoto(carId, file) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const fileName = `cars/${carId}/${Date.now()}_${file.name}`;
            
            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await this.supabase.storage
                .from('car-photos')
                .upload(fileName, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: urlData } = this.supabase.storage
                .from('car-photos')
                .getPublicUrl(fileName);

            // Save photo reference to database
            const photoData = {
                car_id: carId,
                url: urlData.publicUrl,
                filename: fileName,
                uploaded_by: this.currentUser.id,
                created_at: new Date().toISOString()
            };

            const { data: photo, error: photoError } = await this.supabase
                .from('car_photos')
                .insert([photoData])
                .select()
                .single();

            if (photoError) {
                throw photoError;
            }

            console.log('✅ Car photo uploaded successfully:', urlData.publicUrl);
            return photo;

        } catch (error) {
            console.error('❌ Error uploading car photo:', error);
            throw error;
        }
    }

    // Get car photos
    async getCarPhotos(carId) {
        try {
            const { data: photos, error } = await this.supabase
                .from('car_photos')
                .select('*')
                .eq('car_id', carId);

            if (error) {
                throw error;
            }

            return photos || [];

        } catch (error) {
            console.error('❌ Error getting car photos:', error);
            throw error;
        }
    }

    // Delete car photo
    async deleteCarPhoto(photoId) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            // Get photo data first
            const { data: photo, error: photoError } = await this.supabase
                .from('car_photos')
                .select('*')
                .eq('id', photoId)
                .single();

            if (photoError || !photo) {
                throw new Error('Photo not found');
            }

            // Delete from storage
            const { error: storageError } = await this.supabase.storage
                .from('car-photos')
                .remove([photo.filename]);

            if (storageError) {
                throw storageError;
            }

            // Delete from database
            const { error: deleteError } = await this.supabase
                .from('car_photos')
                .delete()
                .eq('id', photoId);

            if (deleteError) {
                throw deleteError;
            }

            console.log('✅ Car photo deleted successfully:', photoId);

        } catch (error) {
            console.error('❌ Error deleting car photo:', error);
            throw error;
        }
    }

    // ==================== NOTIFICATIONS ====================

    // Create notification
    async createNotification(notificationData) {
        try {
            const notification = {
                ...notificationData,
                created_at: new Date().toISOString(),
                is_read: false
            };

            const { data, error } = await this.supabase
                .from('notifications')
                .insert([notification])
                .select()
                .single();

            if (error) {
                throw error;
            }

            console.log('✅ Notification created successfully:', data.id);
            return data;

        } catch (error) {
            console.error('❌ Error creating notification:', error);
            throw error;
        }
    }

    // Get user notifications
    async getUserNotifications(userId) {
        try {
            const { data: notifications, error } = await this.supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId);

            if (error) {
                throw error;
            }

            return notifications || [];

        } catch (error) {
            console.error('❌ Error getting notifications:', error);
            throw error;
        }
    }

    // Mark notification as read
    async markNotificationAsRead(notificationId) {
        try {
            const { error } = await this.supabase
                .from('notifications')
                .update({
                    is_read: true,
                    read_at: new Date().toISOString()
                })
                .eq('id', notificationId);

            if (error) {
                throw error;
            }

            console.log('✅ Notification marked as read:', notificationId);

        } catch (error) {
            console.error('❌ Error marking notification as read:', error);
            throw error;
        }
    }

    // ==================== REAL-TIME LISTENERS ====================

    // Listen to user data changes
    onUserDataChange(userId, callback) {
        return this.supabase
            .channel(`user:${userId}`)
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'users', filter: `id=eq.${userId}` },
                (payload) => {
                    callback(payload.new ? { id: userId, ...payload.new } : null);
                }
            )
            .subscribe();
    }

    // Listen to cars changes
    onCarsChange(callback) {
        return this.supabase
            .channel('cars')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'cars' },
                (payload) => {
                    // This will trigger on any car change, you might want to fetch all cars
                    this.getAllCars().then(cars => callback(cars));
                }
            )
            .subscribe();
    }

    // Listen to bookings changes
    onBookingsChange(userId, userType, callback) {
        const queryField = userType === 'owner' ? 'owner_id' : 'renter_id';
        return this.supabase
            .channel(`bookings:${userId}`)
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'bookings', filter: `${queryField}=eq.${userId}` },
                (payload) => {
                    // This will trigger on any booking change for this user
                    this.getBookingsByUser(userType).then(bookings => callback(bookings));
                }
            )
            .subscribe();
    }

    // Listen to notifications changes
    onNotificationsChange(userId, callback) {
        return this.supabase
            .channel(`notifications:${userId}`)
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
                (payload) => {
                    // This will trigger on any notification change for this user
                    this.getUserNotifications(userId).then(notifications => callback(notifications));
                }
            )
            .subscribe();
    }

    // Cleanup listeners
    off(channel) {
        this.supabase.removeChannel(channel);
    }

    // ==================== UTILITY METHODS ====================

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }

    // Get user type
    async getUserType() {
        if (!this.currentUser) {
            return null;
        }

        try {
            const profile = await this.getCurrentUserProfile();
            return profile?.user_type || null;
        } catch (error) {
            console.error('❌ Error getting user type:', error);
            return null;
        }
    }

    // Generate unique ID
    generateId() {
        return crypto.randomUUID();
    }

    // Format timestamp
    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString('ar-SA');
    }
}

// Create global instance
const supabaseService = new SupabaseService();

// Export for use in other files
if (typeof window !== 'undefined') {
    window.supabaseService = supabaseService;
}

// Initialize when DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 Supabase Service ready');
    });
}

module.exports = { SupabaseService, supabaseService };

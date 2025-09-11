// Supabase Service - Complete Database Service for Car Rental Platform
// This service replaces Firebase and handles all data operations with Supabase

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
            if (typeof supabase === 'undefined') {
                throw new Error('Supabase SDK not loaded');
            }

            // Initialize Supabase client
            this.supabase = supabase.createClient(
                'https://nhmgolhyebehkmvlutir.supabase.co',
                'your-anon-key-here' // Replace with your actual anon key
            );

            console.log('🔵 Supabase Service initialized successfully');
            
            // Set up auth state listener
            this.supabase.auth.onAuthStateChange((event, session) => {
                this.currentUser = session?.user || null;
                console.log('Auth state changed:', event, this.currentUser ? 'User logged in' : 'User logged out');
            });

        } catch (error) {
            console.error('❌ Supabase initialization failed:', error);
            // Fallback to localStorage if Supabase fails
            console.log('🔄 Falling back to localStorage');
        }
    }

    // ==================== AUTHENTICATION ====================

    // Register new user
    async registerUser(userData) {
        try {
            if (!this.supabase) {
                throw new Error('Supabase not available');
            }

            // Create Supabase Auth user
            const { data: authData, error: authError } = await this.supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        full_name: userData.full_name,
                        phone: userData.phone,
                        city: userData.city,
                        user_type: userData.user_type
                    }
                }
            });

            if (authError) {
                throw authError;
            }

            const user = authData.user;

            // Store additional user data in profiles table
            const { data: profileData, error: profileError } = await this.supabase
                .from('profiles')
                .insert([
                    {
                        id: user.id,
                        email: userData.email,
                        full_name: userData.full_name,
                        phone: userData.phone,
                        city: userData.city,
                        user_type: userData.user_type,
                        is_active: true
                    }
                ])
                .select()
                .single();

            if (profileError) {
                console.error('Profile creation error:', profileError);
                // Don't throw error, user is still created in auth
            }

            console.log('✅ User registered successfully:', user.id);
            return { 
                user, 
                profile: profileData || {
                    id: user.id,
                    email: userData.email,
                    full_name: userData.full_name,
                    phone: userData.phone,
                    city: userData.city,
                    user_type: userData.user_type
                }
            };

        } catch (error) {
            console.error('❌ Registration failed:', error);
            throw error;
        }
    }

    // Login user
    async loginUser(email, password) {
        try {
            if (!this.supabase) {
                throw new Error('Supabase not available');
            }

            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                throw error;
            }

            const user = data.user;

            // Get user profile from database
            const { data: profile, error: profileError } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error('Profile fetch error:', profileError);
                // Return basic user data if profile not found
                return { 
                    user, 
                    profile: {
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata?.full_name || '',
                        user_type: user.user_metadata?.user_type || 'renter'
                    }
                };
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
            if (!this.supabase) {
                throw new Error('Supabase not available');
            }

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
        if (!this.currentUser || !this.supabase) {
            return null;
        }

        try {
            const { data, error } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) {
                console.error('❌ Error getting user profile:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('❌ Error getting user profile:', error);
            return null;
        }
    }

    // Update user profile
    async updateUserProfile(updates) {
        if (!this.currentUser || !this.supabase) {
            throw new Error('No user logged in or Supabase not available');
        }

        try {
            const { data, error } = await this.supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', this.currentUser.id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            console.log('✅ User profile updated successfully');
            return data;
        } catch (error) {
            console.error('❌ Error updating user profile:', error);
            throw error;
        }
    }

    // ==================== CARS MANAGEMENT ====================

    // Create new car
    async createCar(carData) {
        if (!this.currentUser || !this.supabase) {
            throw new Error('No user logged in or Supabase not available');
        }

        try {
            const { data, error } = await this.supabase
                .from('cars')
                .insert([
                    {
                        owner_id: this.currentUser.id,
                        ...carData,
                        is_available: true,
                        status: 'active'
                    }
                ])
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
            if (!this.supabase) {
                throw new Error('Supabase not available');
            }

            const { data, error } = await this.supabase
                .from('cars')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data || [];

        } catch (error) {
            console.error('❌ Error getting cars:', error);
            throw error;
        }
    }

    // Get cars by owner
    async getCarsByOwner(ownerId = null) {
        try {
            if (!this.supabase) {
                throw new Error('Supabase not available');
            }

            const userId = ownerId || this.currentUser?.id;
            if (!userId) {
                throw new Error('No user ID provided');
            }

            const { data, error } = await this.supabase
                .from('cars')
                .select('*')
                .eq('owner_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data || [];

        } catch (error) {
            console.error('❌ Error getting cars by owner:', error);
            throw error;
        }
    }

    // Get car by ID
    async getCarById(carId) {
        try {
            if (!this.supabase) {
                throw new Error('Supabase not available');
            }

            const { data, error } = await this.supabase
                .from('cars')
                .select('*')
                .eq('id', carId)
                .single();

            if (error) {
                throw error;
            }

            return data;

        } catch (error) {
            console.error('❌ Error getting car:', error);
            throw error;
        }
    }

    // Update car
    async updateCar(carId, updates) {
        if (!this.currentUser || !this.supabase) {
            throw new Error('No user logged in or Supabase not available');
        }

        try {
            const { data, error } = await this.supabase
                .from('cars')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', carId)
                .eq('owner_id', this.currentUser.id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            console.log('✅ Car updated successfully:', carId);
            return data;

        } catch (error) {
            console.error('❌ Error updating car:', error);
            throw error;
        }
    }

    // Delete car
    async deleteCar(carId) {
        if (!this.currentUser || !this.supabase) {
            throw new Error('No user logged in or Supabase not available');
        }

        try {
            const { error } = await this.supabase
                .from('cars')
                .delete()
                .eq('id', carId)
                .eq('owner_id', this.currentUser.id);

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
        if (!this.currentUser || !this.supabase) {
            throw new Error('No user logged in or Supabase not available');
        }

        try {
            const { data, error } = await this.supabase
                .from('bookings')
                .insert([
                    {
                        renter_id: this.currentUser.id,
                        ...bookingData,
                        status: 'pending'
                    }
                ])
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
        if (!this.currentUser || !this.supabase) {
            throw new Error('No user logged in or Supabase not available');
        }

        try {
            const queryField = userType === 'owner' ? 'owner_id' : 'renter_id';
            const { data, error } = await this.supabase
                .from('bookings')
                .select('*')
                .eq(queryField, this.currentUser.id)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data || [];

        } catch (error) {
            console.error('❌ Error getting bookings:', error);
            throw error;
        }
    }

    // Update booking status
    async updateBookingStatus(bookingId, status) {
        if (!this.currentUser || !this.supabase) {
            throw new Error('No user logged in or Supabase not available');
        }

        try {
            const { data, error } = await this.supabase
                .from('bookings')
                .update({
                    status: status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', bookingId)
                .select()
                .single();

            if (error) {
                throw error;
            }

            console.log('✅ Booking status updated:', bookingId, status);
            return data;

        } catch (error) {
            console.error('❌ Error updating booking status:', error);
            throw error;
        }
    }

    // ==================== PHOTOS MANAGEMENT ====================

    // Upload car photo
    async uploadCarPhoto(carId, file) {
        if (!this.currentUser || !this.supabase) {
            throw new Error('No user logged in or Supabase not available');
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
            const { data: photoData, error: photoError } = await this.supabase
                .from('car_photos')
                .insert([
                    {
                        car_id: carId,
                        url: urlData.publicUrl,
                        filename: fileName,
                        uploaded_by: this.currentUser.id
                    }
                ])
                .select()
                .single();

            if (photoError) {
                throw photoError;
            }

            console.log('✅ Car photo uploaded successfully:', urlData.publicUrl);
            return photoData;

        } catch (error) {
            console.error('❌ Error uploading car photo:', error);
            throw error;
        }
    }

    // Get car photos
    async getCarPhotos(carId) {
        try {
            if (!this.supabase) {
                throw new Error('Supabase not available');
            }

            const { data, error } = await this.supabase
                .from('car_photos')
                .select('*')
                .eq('car_id', carId)
                .order('created_at', { ascending: true });

            if (error) {
                throw error;
            }

            return data || [];

        } catch (error) {
            console.error('❌ Error getting car photos:', error);
            throw error;
        }
    }

    // ==================== NOTIFICATIONS ====================

    // Create notification
    async createNotification(notificationData) {
        try {
            if (!this.supabase) {
                throw new Error('Supabase not available');
            }

            const { data, error } = await this.supabase
                .from('notifications')
                .insert([
                    {
                        ...notificationData,
                        is_read: false
                    }
                ])
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
            if (!this.supabase) {
                throw new Error('Supabase not available');
            }

            const { data, error } = await this.supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data || [];

        } catch (error) {
            console.error('❌ Error getting notifications:', error);
            throw error;
        }
    }

    // Mark notification as read
    async markNotificationAsRead(notificationId) {
        try {
            if (!this.supabase) {
                throw new Error('Supabase not available');
            }

            const { data, error } = await this.supabase
                .from('notifications')
                .update({
                    is_read: true,
                    read_at: new Date().toISOString()
                })
                .eq('id', notificationId)
                .select()
                .single();

            if (error) {
                throw error;
            }

            console.log('✅ Notification marked as read:', notificationId);
            return data;

        } catch (error) {
            console.error('❌ Error marking notification as read:', error);
            throw error;
        }
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

    // Format timestamp
    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString('ar-SA');
    }

    // ==================== FALLBACK METHODS ====================

    // Fallback to localStorage when Supabase is not available
    async registerUserFallback(userData) {
        try {
            // Check if email already exists
            const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
            const emailExists = existingUsers.find(user => user.email === userData.email);
            
            if (emailExists) {
                throw new Error('البريد الإلكتروني مستخدم بالفعل');
            }
            
            // Create user object
            const newUser = {
                id: 'user-' + Date.now(),
                full_name: userData.full_name,
                email: userData.email,
                phone: userData.phone,
                city: userData.city,
                password: userData.password,
                user_type: userData.user_type,
                created_at: new Date().toISOString(),
                is_active: true
            };
            
            // Add user to localStorage
            existingUsers.push(newUser);
            localStorage.setItem('mockUsers', JSON.stringify(existingUsers));
            
            // Create mock token
            const token = 'mock-token-' + Date.now();
            localStorage.setItem('userToken', token);
            localStorage.setItem('userData', JSON.stringify(newUser));
            localStorage.setItem('userType', userData.user_type);
            
            console.log('✅ User registered successfully with localStorage fallback:', newUser.id);
            return { user: { uid: newUser.id }, profile: newUser };
            
        } catch (error) {
            console.error('❌ localStorage registration failed:', error);
            throw error;
        }
    }
}

// Create global instance
const supabaseService = new SupabaseService();

// Export for use in other files
window.supabaseService = supabaseService;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Supabase Service ready');
});
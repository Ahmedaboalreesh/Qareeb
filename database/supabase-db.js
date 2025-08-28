const { supabase } = require('../supabase-config');

class SupabaseDatabase {
    constructor() {
        this.supabase = supabase;
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            console.log('🔥 Initializing Supabase Database Service...');
            
            // Test connection
            const { error } = await this.supabase
                .from('users')
                .select('count')
                .limit(1);

            if (error) {
                console.error('❌ Supabase connection failed:', error);
                throw error;
            }

            this.initialized = true;
            console.log('✅ Supabase Database Service initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Supabase Database Service:', error);
            throw error;
        }
    }

    // ==================== USER MANAGEMENT ====================

    async createUser(userData) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .insert([userData])
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('❌ Error creating user:', error);
            throw error;
        }
    }

    async getUserById(userId) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('❌ Error getting user:', error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('❌ Error getting user by email:', error);
            throw error;
        }
    }

    async updateUser(userId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('❌ Error updating user:', error);
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            const { error } = await this.supabase
                .from('users')
                .delete()
                .eq('id', userId);

            if (error) {
                throw error;
            }

            return true;
        } catch (error) {
            console.error('❌ Error deleting user:', error);
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*');

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('❌ Error getting all users:', error);
            throw error;
        }
    }

    // ==================== CAR MANAGEMENT ====================

    async createCar(carData) {
        try {
            const { data, error } = await this.supabase
                .from('cars')
                .insert([carData])
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('❌ Error creating car:', error);
            throw error;
        }
    }

    async getCarById(carId) {
        try {
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

    async getCarsByOwner(ownerId) {
        try {
            const { data, error } = await this.supabase
                .from('cars')
                .select('*')
                .eq('owner_id', ownerId);

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('❌ Error getting cars by owner:', error);
            throw error;
        }
    }

    async getAllCars() {
        try {
            const { data, error } = await this.supabase
                .from('cars')
                .select('*');

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('❌ Error getting all cars:', error);
            throw error;
        }
    }

    async updateCar(carId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('cars')
                .update(updates)
                .eq('id', carId)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('❌ Error updating car:', error);
            throw error;
        }
    }

    async deleteCar(carId) {
        try {
            const { error } = await this.supabase
                .from('cars')
                .delete()
                .eq('id', carId);

            if (error) {
                throw error;
            }

            return true;
        } catch (error) {
            console.error('❌ Error deleting car:', error);
            throw error;
        }
    }

    // ==================== BOOKING MANAGEMENT ====================

    async createBooking(bookingData) {
        try {
            const { data, error } = await this.supabase
                .from('bookings')
                .insert([bookingData])
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('❌ Error creating booking:', error);
            throw error;
        }
    }

    async getBookingById(bookingId) {
        try {
            const { data, error } = await this.supabase
                .from('bookings')
                .select('*')
                .eq('id', bookingId)
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('❌ Error getting booking:', error);
            throw error;
        }
    }

    async getBookingsByUser(userId, userType = 'renter') {
        try {
            const queryField = userType === 'owner' ? 'owner_id' : 'renter_id';
            const { data, error } = await this.supabase
                .from('bookings')
                .select('*')
                .eq(queryField, userId);

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('❌ Error getting bookings by user:', error);
            throw error;
        }
    }

    async getAllBookings() {
        try {
            const { data, error } = await this.supabase
                .from('bookings')
                .select('*');

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('❌ Error getting all bookings:', error);
            throw error;
        }
    }

    async updateBooking(bookingId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('bookings')
                .update(updates)
                .eq('id', bookingId)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('❌ Error updating booking:', error);
            throw error;
        }
    }

    async deleteBooking(bookingId) {
        try {
            const { error } = await this.supabase
                .from('bookings')
                .delete()
                .eq('id', bookingId);

            if (error) {
                throw error;
            }

            return true;
        } catch (error) {
            console.error('❌ Error deleting booking:', error);
            throw error;
        }
    }

    // ==================== PHOTO MANAGEMENT ====================

    async uploadCarPhoto(carId, file, uploadedBy) {
        try {
            const fileName = `cars/${carId}/${Date.now()}_${file.originalname}`;
            
            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await this.supabase.storage
                .from('car-photos')
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype
                });

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
                uploaded_by: uploadedBy,
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

            return photo;
        } catch (error) {
            console.error('❌ Error uploading car photo:', error);
            throw error;
        }
    }

    async getCarPhotos(carId) {
        try {
            const { data, error } = await this.supabase
                .from('car_photos')
                .select('*')
                .eq('car_id', carId);

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('❌ Error getting car photos:', error);
            throw error;
        }
    }

    async deleteCarPhoto(photoId) {
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

            return true;
        } catch (error) {
            console.error('❌ Error deleting car photo:', error);
            throw error;
        }
    }

    // ==================== NOTIFICATION MANAGEMENT ====================

    async createNotification(notificationData) {
        try {
            const { data, error } = await this.supabase
                .from('notifications')
                .insert([notificationData])
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('❌ Error creating notification:', error);
            throw error;
        }
    }

    async getNotificationsByUser(userId) {
        try {
            const { data, error } = await this.supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId);

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('❌ Error getting notifications by user:', error);
            throw error;
        }
    }

    async updateNotification(notificationId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('notifications')
                .update(updates)
                .eq('id', notificationId)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('❌ Error updating notification:', error);
            throw error;
        }
    }

    async deleteNotification(notificationId) {
        try {
            const { error } = await this.supabase
                .from('notifications')
                .delete()
                .eq('id', notificationId);

            if (error) {
                throw error;
            }

            return true;
        } catch (error) {
            console.error('❌ Error deleting notification:', error);
            throw error;
        }
    }

    // ==================== UTILITY METHODS ====================

    async clearAllData() {
        try {
            console.log('🗑️ Clearing all data from Supabase...');

            // Delete in reverse order to respect foreign key constraints
            const tables = ['notifications', 'car_photos', 'bookings', 'cars', 'users'];
            
            for (const table of tables) {
                const { error } = await this.supabase
                    .from(table)
                    .delete()
                    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except dummy record

                if (error) {
                    console.warn(`⚠️ Could not clear table ${table}:`, error.message);
                } else {
                    console.log(`✅ Cleared table ${table}`);
                }
            }

            console.log('✅ All data cleared successfully');
            return true;
        } catch (error) {
            console.error('❌ Error clearing all data:', error);
            throw error;
        }
    }

    async getDatabaseStats() {
        try {
            const stats = {};

            const tables = ['users', 'cars', 'bookings', 'car_photos', 'notifications'];
            
            for (const table of tables) {
                const { count, error } = await this.supabase
                    .from(table)
                    .select('*', { count: 'exact', head: true });

                if (error) {
                    console.warn(`⚠️ Could not get count for ${table}:`, error.message);
                    stats[table] = 'Error';
                } else {
                    stats[table] = count;
                }
            }

            return stats;
        } catch (error) {
            console.error('❌ Error getting database stats:', error);
            throw error;
        }
    }

    // Close database connection (not needed for Supabase)
    async close() {
        console.log('🔌 Supabase connection closed (no explicit closing needed)');
        // Supabase doesn't require explicit connection closing
    }
}

module.exports = new SupabaseDatabase();

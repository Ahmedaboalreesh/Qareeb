// Login page functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const userTypeOptions = document.querySelectorAll('.type-option');
    const messageContainer = document.getElementById('messageContainer');
    
    let selectedUserType = 'renter'; // Default selection

    // User type selection
    userTypeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            userTypeOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            // Update selected user type
            selectedUserType = this.dataset.type;
        });
    });

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validation
        if (!email || !password) {
            showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('يرجى إدخال بريد إلكتروني صحيح', 'error');
            return;
        }

        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الدخول...';
        submitBtn.disabled = true;

        try {
            // For now, we'll use a simple authentication approach
            // In a real application, this would call your backend API
            const userData = await authenticateUser(email, password, selectedUserType);
            
            if (userData) {
                // Store user data and token
                localStorage.setItem('userToken', userData.token);
                localStorage.setItem('userData', JSON.stringify(userData.user));
                localStorage.setItem('userType', selectedUserType);
                
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }

                showMessage('تم تسجيل الدخول بنجاح', 'success');
                
                // Redirect based on user type
                setTimeout(() => {
                    if (selectedUserType === 'owner') {
                        window.location.href = 'dashboard.html';
                    } else {
                        window.location.href = 'renter-dashboard.html';
                    }
                }, 1500);
            } else {
                showMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage('حدث خطأ في الاتصال بالخادم', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Mock authentication function (replace with actual API call)
    async function authenticateUser(email, password, userType) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demonstration purposes, accept any email/password combination
        // In a real application, this would validate against your backend
        if (email && password) {
            return {
                token: 'mock-jwt-token-' + Date.now(),
                user: {
                    id: 1,
                    full_name: userType === 'owner' ? 'أحمد محمد' : 'سارة أحمد',
                    email: email,
                    phone: '+966501234567',
                    city: 'الرياض',
                    user_type: userType
                }
            };
        }
        return null;
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show message function
    function showMessage(message, type) {
        const messageContent = messageContainer.querySelector('.message-content');
        const messageIcon = messageContent.querySelector('.message-icon');
        const messageText = messageContent.querySelector('.message-text');

        messageText.textContent = message;
        
        // Set icon and class based on message type
        if (type === 'success') {
            messageIcon.className = 'message-icon fas fa-check-circle';
            messageContainer.className = 'message-container success';
        } else if (type === 'error') {
            messageIcon.className = 'message-icon fas fa-exclamation-circle';
            messageContainer.className = 'message-container error';
        }

        messageContainer.style.display = 'block';

        // Auto hide after 5 seconds
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    }

    // Check if user is already logged in
    const userToken = localStorage.getItem('userToken');
    const userType = localStorage.getItem('userType');
    
    if (userToken && userType) {
        // Redirect to appropriate dashboard
        if (userType === 'owner') {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'renter-dashboard.html';
        }
    }
});

// Password toggle function
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    localStorage.removeItem('rememberMe');
    
    window.location.href = 'index.html';
}

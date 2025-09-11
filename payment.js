// Payment page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Initializing payment page...');
    
    // Load booking data from URL parameters or localStorage
    loadBookingData();
    
    // Setup payment method selection
    setupPaymentMethods();
    
    // Setup form validation
    setupFormValidation();
    
    console.log('✅ Payment page initialized');
});

// Load booking data
function loadBookingData() {
    try {
        // Get booking data from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = urlParams.get('booking_id');
        
        // Load booking data from localStorage
        const bookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        console.log('🔍 All bookings:', bookings);
        console.log('🔍 Looking for booking ID:', bookingId);
        
        const booking = bookings.find(b => b.id == bookingId); // Use == for type coercion
        console.log('🔍 Found booking:', booking);
        
        if (booking) {
            // Get car details from localStorage or use default
            const cars = JSON.parse(localStorage.getItem('mockCars') || '[]');
            const car = cars.find(c => c.id == booking.car_id); // Use == for type coercion
            
            console.log('🔍 Found booking:', booking);
            console.log('🔍 Found car:', car);
            
            const bookingWithCarInfo = {
                ...booking,
                car_name: car ? `${car.brand} ${car.model} ${car.year}` : 'تويوتا كامري 2023',
                daily_rate: booking.daily_rate || (car ? car.daily_rate : 150), // Use booking daily_rate if available
                // Include delivery information from booking
                delivery_choice: booking.delivery_choice || null,
                delivery_fee: booking.delivery_fee || null
            };
            
            console.log('🔍 Booking with car info:', bookingWithCarInfo);
            
            updatePaymentSummary(bookingWithCarInfo);
        } else {
            // Use default data for testing
            updatePaymentSummary({
                car_name: 'تويوتا كامري 2023',
                start_date: '2024-01-15',
                end_date: '2024-01-18',
                daily_rate: 150,
                total_amount: 450,
                delivery_choice: 'no',
                delivery_fee: 0
            });
        }
        
    } catch (error) {
        console.error('❌ Error loading booking data:', error);
        showMessage('حدث خطأ في تحميل بيانات الحجز', 'error');
    }
}

// Update payment summary
function updatePaymentSummary(booking) {
    try {
        console.log('🔍 Updating payment summary with booking:', booking);
        
        // Calculate days
        const startDate = new Date(booking.start_date);
        const endDate = new Date(booking.end_date);
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        // Calculate total amount using the same logic as car-details.js
        const baseAmount = daysDiff * (booking.daily_rate || 150);
        const deliveryFee = (booking.delivery_choice === 'yes' && booking.delivery_fee) ? booking.delivery_fee : 0;
        const calculatedTotalAmount = baseAmount + deliveryFee;
        
        console.log('📊 Calculation details:', {
            days: daysDiff,
            dailyRate: booking.daily_rate || 150,
            baseAmount: baseAmount,
            deliveryChoice: booking.delivery_choice,
            deliveryFee: deliveryFee,
            calculatedTotal: calculatedTotalAmount,
            storedTotal: booking.total_amount
        });
        
        // Update summary elements
        document.getElementById('carName').textContent = booking.car_name || 'تويوتا كامري 2023';
        document.getElementById('startDate').textContent = formatDate(startDate);
        document.getElementById('endDate').textContent = formatDate(endDate);
        document.getElementById('daysCount').textContent = `${daysDiff} أيام`;
        document.getElementById('dailyRate').textContent = `${booking.daily_rate || 150} ريال`;
        
        // Update delivery information
        updateDeliverySummary(booking);
        
        // Use calculated total amount instead of stored one to ensure consistency
        document.getElementById('totalAmount').textContent = `${calculatedTotalAmount} ريال`;
        document.getElementById('payAmount').textContent = `${calculatedTotalAmount} ريال`;
        
        console.log('✅ Payment summary updated successfully');
        
    } catch (error) {
        console.error('❌ Error updating payment summary:', error);
    }
}

// Update delivery summary
function updateDeliverySummary(booking) {
    const deliveryInfo = document.getElementById('deliveryInfo');
    const deliveryFee = document.getElementById('deliveryFee');
    const deliveryChoice = document.getElementById('deliveryChoice');
    const deliveryFeeAmount = document.getElementById('deliveryFeeAmount');
    
    // Check if delivery choice exists
    if (booking.delivery_choice) {
        deliveryInfo.style.display = 'flex';
        
        if (booking.delivery_choice === 'yes') {
            deliveryChoice.textContent = 'توصيل السيارة إلى موقعي';
            
            // Show delivery fee if it exists and is greater than 0
            if (booking.delivery_fee && booking.delivery_fee > 0) {
                deliveryFee.style.display = 'flex';
                deliveryFeeAmount.textContent = `${booking.delivery_fee} ريال`;
            } else if (booking.delivery_fee === 0) {
                deliveryFee.style.display = 'flex';
                deliveryFeeAmount.textContent = 'مجاني';
            } else {
                deliveryFee.style.display = 'none';
            }
        } else {
            deliveryChoice.textContent = 'استلام السيارة من موقع المالك';
            deliveryFee.style.display = 'none';
        }
    } else {
        // Hide delivery information if no delivery choice
        deliveryInfo.style.display = 'none';
        deliveryFee.style.display = 'none';
    }
}

// Format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ar-SA', options);
}

// Setup payment methods
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentForms = document.querySelectorAll('.payment-form');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            const methodType = this.dataset.method;
            
            // Update selected method
            paymentMethods.forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
            
            // Show corresponding form
            paymentForms.forEach(form => {
                form.style.display = 'none';
            });
            
            const targetForm = document.getElementById(`${methodType}Form`);
            if (targetForm) {
                targetForm.style.display = 'block';
            }
            
            // Update radio button
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
            
            console.log('🔔 Selected payment method:', methodType);
        });
    });
}

// Setup form validation
function setupFormValidation() {
    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            value = value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value;
        });
    }
    
    // Expiry date formatting
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVV validation
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    

}

// Process payment
function processPayment() {
    try {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
        
        if (!selectedMethod) {
            showMessage('يرجى اختيار طريقة دفع', 'error');
            return;
        }
        
        const methodType = selectedMethod.value;
        console.log('🔔 Processing payment with method:', methodType);
        
        // Validate form based on method
        if (!validatePaymentForm(methodType)) {
            return;
        }
        
        // Show loading modal
        showLoadingModal();
        
        // Simulate payment processing
        setTimeout(() => {
            hideLoadingModal();
            showSuccessModal();
            
            // Save payment to localStorage
            savePaymentRecord(methodType);
            
        }, 3000);
        
    } catch (error) {
        console.error('❌ Error processing payment:', error);
        hideLoadingModal();
        showMessage('حدث خطأ في معالجة الدفع', 'error');
    }
}

// Validate payment form
function validatePaymentForm(methodType) {
    switch (methodType) {
        case 'cash':
            return true; // No validation needed for cash
            

            
        case 'credit':
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            const cardName = document.getElementById('cardName').value;
            
            if (!cardNumber || cardNumber.length < 13) {
                showMessage('يرجى إدخال رقم بطاقة صحيح', 'error');
                return false;
            }
            
            if (!expiryDate || expiryDate.length !== 5) {
                showMessage('يرجى إدخال تاريخ انتهاء صحيح', 'error');
                return false;
            }
            
            if (!cvv || cvv.length < 3) {
                showMessage('يرجى إدخال رمز CVV صحيح', 'error');
                return false;
            }
            
            if (!cardName.trim()) {
                showMessage('يرجى إدخال اسم حامل البطاقة', 'error');
                return false;
            }
            
            return true;
            
        case 'applepay':
            // Check if Apple Pay is available
            if (!window.ApplePaySession || !ApplePaySession.canMakePayments()) {
                showMessage('Apple Pay غير متاح على هذا الجهاز', 'error');
                return false;
            }
            return true;
            
        default:
            return false;
    }
}

// Save payment record
function savePaymentRecord(methodType) {
    try {
        const paymentRecord = {
            id: 'payment-' + Date.now(),
            booking_id: new URLSearchParams(window.location.search).get('booking_id') || 'test-booking',
            method: methodType,
            amount: document.getElementById('totalAmount').textContent,
            status: 'completed',
            created_at: new Date().toISOString(),
            user_id: JSON.parse(localStorage.getItem('userData') || '{}').id || 'test-user'
        };
        
        // Save to localStorage
        const payments = JSON.parse(localStorage.getItem('mockPayments') || '[]');
        payments.push(paymentRecord);
        localStorage.setItem('mockPayments', JSON.stringify(payments));
        
        console.log('✅ Payment record saved:', paymentRecord);
        
    } catch (error) {
        console.error('❌ Error saving payment record:', error);
    }
}

// Show loading modal
function showLoadingModal() {
    const modal = document.getElementById('loadingModal');
    modal.style.display = 'flex';
}

// Hide loading modal
function hideLoadingModal() {
    const modal = document.getElementById('loadingModal');
    modal.style.display = 'none';
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
}

// Hide success modal
function hideSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
}

// Go back
function goBack() {
    window.history.back();
}

// Go to dashboard
function goToDashboard() {
    const userType = localStorage.getItem('userType');
    if (userType === 'owner') {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'renter-dashboard.html';
    }
}

// Show message
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

// Apple Pay integration (mock)
function initializeApplePay() {
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
        const applePayButton = document.getElementById('applePayButton');
        if (applePayButton) {
            applePayButton.addEventListener('click', function() {
                console.log('🍎 Apple Pay button clicked');
                processApplePay();
            });
        }
    }
}

// Process Apple Pay (mock)
function processApplePay() {
    try {
        console.log('🍎 Processing Apple Pay...');
        
        // Show loading
        showLoadingModal();
        
        // Simulate Apple Pay processing
        setTimeout(() => {
            hideLoadingModal();
            showSuccessModal();
            savePaymentRecord('applepay');
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error processing Apple Pay:', error);
        hideLoadingModal();
        showMessage('حدث خطأ في معالجة Apple Pay', 'error');
    }
}

// Initialize Apple Pay when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApplePay();
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const loadingModal = document.getElementById('loadingModal');
    const successModal = document.getElementById('successModal');
    
    if (event.target === loadingModal) {
        hideLoadingModal();
    }
    
    if (event.target === successModal) {
        hideSuccessModal();
    }
});

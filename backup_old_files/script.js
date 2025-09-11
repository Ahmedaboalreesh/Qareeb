// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Search functionality
const searchBtn = document.querySelector('.search-btn');
const searchFields = document.querySelectorAll('.search-field input');

searchBtn.addEventListener('click', () => {
    const location = searchFields[0].value;
    const startDate = searchFields[1].value;
    const endDate = searchFields[2].value;

    if (!location) {
        alert('الرجاء إدخال الموقع');
        searchFields[0].focus();
        return;
    }

    if (!startDate) {
        alert('الرجاء اختيار تاريخ البداية');
        searchFields[1].focus();
        return;
    }

    if (!endDate) {
        alert('الرجاء اختيار تاريخ النهاية');
        searchFields[2].focus();
        return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
        alert('تاريخ النهاية يجب أن يكون بعد تاريخ البداية');
        searchFields[2].focus();
        return;
    }

    // Simulate search (in real app, this would make an API call)
    showSearchResults(location, startDate, endDate);
});

// Show search results
function showSearchResults(location, startDate, endDate) {
    const modal = createModal(`
        <h2>نتائج البحث</h2>
        <p>البحث في: ${location}</p>
        <p>من: ${formatDate(startDate)} إلى: ${formatDate(endDate)}</p>
        <p>تم العثور على 12 سيارة متاحة</p>
        <div style="margin-top: 20px;">
            <button class="btn-primary" onclick="closeModal()">عرض النتائج</button>
        </div>
    `);
    document.body.appendChild(modal);
}

// Format date to Arabic
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
}

// Create modal
function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            ${content}
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            display: block;
            position: fixed;
            z-index: 2000;
            right: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            animation: fadeIn 0.3s;
        }
        .modal-content {
            background-color: #fefefe;
            margin: 10% auto;
            padding: 30px;
            border-radius: 15px;
            width: 90%;
            max-width: 500px;
            position: relative;
            text-align: center;
            animation: slideIn 0.3s;
        }
        .close {
            position: absolute;
            left: 15px;
            top: 15px;
            color: #aaa;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        .close:hover {
            color: black;
        }
        @keyframes fadeIn {
            from {opacity: 0;}
            to {opacity: 1;}
        }
        @keyframes slideIn {
            from {transform: translateY(-50px); opacity: 0;}
            to {transform: translateY(0); opacity: 1;}
        }
    `;
    document.head.appendChild(style);
    
    return modal;
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Car booking functionality
document.querySelectorAll('.btn-book').forEach(btn => {
    btn.addEventListener('click', function() {
        const carCard = this.closest('.car-card');
        const carName = carCard.querySelector('h3').textContent;
        const carPrice = carCard.querySelector('.car-price').textContent;
        
        const modal = createModal(`
            <h2>حجز السيارة</h2>
            <h3>${carName}</h3>
            <p>السعر: ${carPrice}</p>
            <div style="margin: 20px 0;">
                <input type="date" id="booking-start" style="margin: 5px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                <input type="date" id="booking-end" style="margin: 5px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="margin-top: 20px;">
                <button class="btn-primary" onclick="confirmBooking('${carName}')">تأكيد الحجز</button>
                <button class="btn-secondary" onclick="closeModal()" style="margin-right: 10px;">إلغاء</button>
            </div>
        `);
        document.body.appendChild(modal);
    });
});

// Confirm booking
function confirmBooking(carName) {
    const startDate = document.getElementById('booking-start').value;
    const endDate = document.getElementById('booking-end').value;
    
    if (!startDate || !endDate) {
        alert('الرجاء اختيار تواريخ الحجز');
        return;
    }
    
    if (new Date(startDate) >= new Date(endDate)) {
        alert('تاريخ النهاية يجب أن يكون بعد تاريخ البداية');
        return;
    }
    
    closeModal();
    
    const successModal = createModal(`
        <div style="color: #28a745;">
            <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 20px;"></i>
            <h2>تم الحجز بنجاح!</h2>
            <p>تم حجز ${carName}</p>
            <p>من ${formatDate(startDate)} إلى ${formatDate(endDate)}</p>
            <p>سيتم التواصل معك قريباً</p>
            <button class="btn-primary" onclick="closeModal()" style="margin-top: 20px;">حسناً</button>
        </div>
    `);
    document.body.appendChild(successModal);
}

// Hero buttons functionality
document.querySelector('.btn-primary').addEventListener('click', () => {
    document.querySelector('#cars').scrollIntoView({
        behavior: 'smooth'
    });
});

document.querySelector('.btn-secondary').addEventListener('click', () => {
    const modal = createModal(`
        <h2>أجّر سيارتك</h2>
        <p>اربح دخل إضافي من سيارتك</p>
        <form style="text-align: right; margin: 20px 0;">
            <div style="margin: 15px 0;">
                <label>نوع السيارة:</label>
                <input type="text" style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="margin: 15px 0;">
                <label>سنة الصنع:</label>
                <input type="number" style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="margin: 15px 0;">
                <label>السعر المطلوب (يومياً):</label>
                <input type="number" style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="margin: 15px 0;">
                <label>رقم الهاتف:</label>
                <input type="tel" style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 5px;">
            </div>
        </form>
        <div style="margin-top: 20px;">
            <button class="btn-primary" onclick="submitCarRental()">إرسال الطلب</button>
            <button class="btn-secondary" onclick="closeModal()" style="margin-right: 10px;">إلغاء</button>
        </div>
    `);
    document.body.appendChild(modal);
});

// Submit car rental
function submitCarRental() {
    closeModal();
    const successModal = createModal(`
        <div style="color: #28a745;">
            <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 20px;"></i>
            <h2>تم إرسال الطلب بنجاح!</h2>
            <p>سيتم مراجعة طلبك والتواصل معك خلال 24 ساعة</p>
            <button class="btn-primary" onclick="closeModal()" style="margin-top: 20px;">حسناً</button>
        </div>
    `);
    document.body.appendChild(successModal);
}

// Auth buttons functionality
document.querySelector('.btn-login').addEventListener('click', () => {
    const modal = createModal(`
        <h2>تسجيل الدخول</h2>
        <form style="text-align: right; margin: 20px 0;">
            <div style="margin: 15px 0;">
                <label>البريد الإلكتروني:</label>
                <input type="email" style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="margin: 15px 0;">
                <label>كلمة المرور:</label>
                <input type="password" style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 5px;">
            </div>
        </form>
        <div style="margin-top: 20px;">
            <button class="btn-primary" onclick="handleLogin()">دخول</button>
            <button class="btn-secondary" onclick="closeModal()" style="margin-right: 10px;">إلغاء</button>
        </div>
        <p style="margin-top: 15px;">
            <a href="#" onclick="showRegister()" style="color: #2c5aa0;">ليس لديك حساب؟ أنشئ حساباً جديداً</a>
        </p>
    `);
    document.body.appendChild(modal);
});

document.querySelector('.btn-register').addEventListener('click', () => {
    showRegister();
});

function showRegister() {
    closeModal();
    const modal = createModal(`
        <h2>إنشاء حساب جديد</h2>
        <form style="text-align: right; margin: 20px 0;">
            <div style="margin: 15px 0;">
                <label>الاسم الكامل:</label>
                <input type="text" style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="margin: 15px 0;">
                <label>البريد الإلكتروني:</label>
                <input type="email" style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="margin: 15px 0;">
                <label>رقم الهاتف:</label>
                <input type="tel" style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="margin: 15px 0;">
                <label>كلمة المرور:</label>
                <input type="password" style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 5px;">
            </div>
        </form>
        <div style="margin-top: 20px;">
            <button class="btn-primary" onclick="handleRegister()">إنشاء الحساب</button>
            <button class="btn-secondary" onclick="closeModal()" style="margin-right: 10px;">إلغاء</button>
        </div>
        <p style="margin-top: 15px;">
            <a href="#" onclick="document.querySelector('.btn-login').click()" style="color: #2c5aa0;">لديك حساب بالفعل؟ سجل دخولك</a>
        </p>
    `);
    document.body.appendChild(modal);
}

function handleLogin() {
    closeModal();
    const successModal = createModal(`
        <div style="color: #28a745;">
            <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 20px;"></i>
            <h2>أهلاً بك!</h2>
            <p>تم تسجيل الدخول بنجاح</p>
            <button class="btn-primary" onclick="closeModal()" style="margin-top: 20px;">متابعة</button>
        </div>
    `);
    document.body.appendChild(successModal);
}

function handleRegister() {
    closeModal();
    const successModal = createModal(`
        <div style="color: #28a745;">
            <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 20px;"></i>
            <h2>مرحباً بك في كار شير!</h2>
            <p>تم إنشاء حسابك بنجاح</p>
            <p>تحقق من بريدك الإلكتروني لتفعيل الحساب</p>
            <button class="btn-primary" onclick="closeModal()" style="margin-top: 20px;">حسناً</button>
        </div>
    `);
    document.body.appendChild(successModal);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .car-card, .testimonial-card, .step');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Set minimum date for date inputs
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.min = today;
    });
});

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Loading animation for buttons
function addLoadingToButton(button, text = 'جاري التحميل...') {
    const originalText = button.textContent;
    button.textContent = text;
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}
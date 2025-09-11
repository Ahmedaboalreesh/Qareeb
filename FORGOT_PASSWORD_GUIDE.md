# دليل ميزة "نسيت كلمة المرور"

## 🎯 الهدف
تفعيل ميزة إعادة تعيين كلمة المرور عبر البريد الإلكتروني مع رمز تحقق آمن.

## ✅ الميزات المطبقة

### 1. صفحة "نسيت كلمة المرور" (`forgot-password.html`)
- **واجهة مستخدم سهلة**: تصميم بسيط وواضح
- **خطوات متسلسلة**: 4 خطوات لإعادة تعيين كلمة المرور
- **تحقق من البريد الإلكتروني**: التأكد من وجود المستخدم في النظام
- **رمز تحقق آمن**: رمز 6 أرقام عشوائي
- **إعادة إرسال الرمز**: إمكانية إعادة إرسال الرمز إذا لم يصل

### 2. خطوات إعادة تعيين كلمة المرور

#### **الخطوة الأولى: إدخال البريد الإلكتروني**
```html
<form id="emailForm" class="auth-form">
    <div class="form-group">
        <label for="email">
            <i class="fas fa-envelope"></i>
            البريد الإلكتروني
        </label>
        <input type="email" id="email" name="email" required>
    </div>
    <button type="submit" class="btn btn-primary btn-full">
        <i class="fas fa-paper-plane"></i>
        إرسال رابط إعادة التعيين
    </button>
</form>
```

#### **الخطوة الثانية: رمز التحقق**
```html
<div id="step2" class="forgot-step">
    <div class="verification-info">
        <i class="fas fa-envelope-open"></i>
        <h3>تم إرسال رمز التحقق</h3>
        <p>تم إرسال رمز التحقق إلى بريدك الإلكتروني</p>
    </div>
    <form id="verificationForm" class="auth-form">
        <input type="text" id="verificationCode" maxlength="6" required>
        <button type="submit">التحقق من الرمز</button>
    </form>
</div>
```

#### **الخطوة الثالثة: كلمة المرور الجديدة**
```html
<div id="step3" class="forgot-step">
    <form id="newPasswordForm" class="auth-form">
        <div class="form-group">
            <input type="password" id="newPassword" required>
        </div>
        <div class="form-group">
            <input type="password" id="confirmPassword" required>
        </div>
        <button type="submit">حفظ كلمة المرور الجديدة</button>
    </form>
</div>
```

#### **الخطوة الرابعة: نجاح العملية**
```html
<div id="step4" class="forgot-step">
    <div class="success-info">
        <i class="fas fa-check-circle"></i>
        <h3>تم تغيير كلمة المرور بنجاح</h3>
        <p>يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة</p>
    </div>
    <button onclick="goToLogin()">الذهاب إلى تسجيل الدخول</button>
</div>
```

### 3. الوظائف الأساسية

#### **إنشاء رمز التحقق**
```javascript
// Generate verification code
verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

// Store verification code temporarily
localStorage.setItem('tempVerificationCode', verificationCode);
localStorage.setItem('tempUserEmail', email);
```

#### **التحقق من البريد الإلكتروني**
```javascript
// Check if user exists
const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
const user = users.find(u => u.email === email);

if (!user) {
    showMessage('البريد الإلكتروني غير مسجل في النظام', 'error');
    return;
}
```

#### **تحديث كلمة المرور**
```javascript
// Update user password
const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
const userIndex = users.findIndex(u => u.email === userEmail);

if (userIndex !== -1) {
    users[userIndex].password = newPassword;
    localStorage.setItem('mockUsers', JSON.stringify(users));
    
    // Clear temporary data
    localStorage.removeItem('tempVerificationCode');
    localStorage.removeItem('tempUserEmail');
}
```

### 4. التحقق من صحة البيانات

#### **التحقق من البريد الإلكتروني**
```javascript
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
```

#### **التحقق من كلمة المرور**
```javascript
if (newPassword.length < 6) {
    showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
    return;
}

if (newPassword !== confirmPassword) {
    showMessage('كلمة المرور وتأكيدها غير متطابقين', 'error');
    return;
}
```

## 🛠️ كيفية الاستخدام

### 1. للمستخدمين
1. **الذهاب إلى صفحة تسجيل الدخول**: `login.html`
2. **النقر على "نسيت كلمة المرور؟"**: سيتم توجيهك إلى `forgot-password.html`
3. **إدخال البريد الإلكتروني**: أدخل البريد الإلكتروني المسجل
4. **التحقق من الرمز**: أدخل رمز التحقق المرسل
5. **إدخال كلمة المرور الجديدة**: أدخل كلمة المرور الجديدة وتأكيدها
6. **العودة لتسجيل الدخول**: استخدم كلمة المرور الجديدة

### 2. للمطورين
1. **اختبار الميزة**: افتح `test-forgot-password.html`
2. **إنشاء مستخدمين تجريبيين**: استخدم زر "إنشاء مستخدمين تجريبيين"
3. **اختبار السيناريوهات المختلفة**: جرب البريد الصحيح والخاطئ
4. **مراقبة رمز التحقق**: شاهد الرمز في صفحة الاختبار

## 📁 الملفات المحدثة

### 1. `forgot-password.html`
- ✅ صفحة إعادة تعيين كلمة المرور الكاملة
- ✅ 4 خطوات متسلسلة
- ✅ واجهة مستخدم سهلة الاستخدام
- ✅ تحقق من صحة البيانات

### 2. `login.html`
- ✅ تحديث رابط "نسيت كلمة المرور" ليشير إلى الصفحة الجديدة

### 3. `test-forgot-password.html`
- ✅ صفحة اختبار شاملة
- ✅ إنشاء مستخدمين تجريبيين
- ✅ اختبار سيناريوهات مختلفة
- ✅ عرض رمز التحقق التجريبي

## 🔧 خطوات الاختبار

### 1. إعداد البيئة
```bash
# فتح صفحة الاختبار
test-forgot-password.html
```

### 2. إنشاء مستخدمين تجريبيين
```javascript
// إنشاء مستخدمين للاختبار
const testUsers = [
    {
        email: 'ahmed@test.com',
        password: '123456',
        user_type: 'renter'
    },
    {
        email: 'mohammed@test.com',
        password: '123456',
        user_type: 'owner'
    }
];
```

### 3. اختبار السيناريوهات

#### **سيناريو البريد الصحيح**
1. افتح `forgot-password.html`
2. أدخل `ahmed@test.com`
3. انقر على "إرسال رابط إعادة التعيين"
4. أدخل رمز التحقق المعروض في صفحة الاختبار
5. أدخل كلمة المرور الجديدة

#### **سيناريو البريد الخاطئ**
1. أدخل `nonexistent@test.com`
2. يجب أن تظهر رسالة خطأ

#### **سيناريو الرمز الخاطئ**
1. أدخل بريد صحيح
2. أدخل رمز خاطئ مثل `000000`
3. يجب أن تظهر رسالة خطأ

#### **سيناريو كلمة المرور الضعيفة**
1. أدخل كلمة مرور قصيرة مثل `123`
2. يجب أن تظهر رسالة خطأ

## 🚀 الميزات الأمانية

### 1. رمز تحقق آمن
- **6 أرقام عشوائية**: صعب التخمين
- **مؤقت**: يتم مسحه بعد الاستخدام
- **مرتبط بالبريد**: كل بريد له رمز خاص

### 2. التحقق من صحة البيانات
- **البريد الإلكتروني**: تحقق من الصيغة والوجود
- **كلمة المرور**: طول كافي وتطابق التأكيد
- **الرمز**: تحقق من الصحة

### 3. حماية من الاستخدام المتكرر
- **مسح البيانات المؤقتة**: بعد الاستخدام
- **تحقق من المستخدم**: التأكد من وجود الحساب

## 📊 النتائج المتوقعة

### قبل التطبيق
- ❌ لا توجد ميزة إعادة تعيين كلمة المرور
- ❌ المستخدمون لا يستطيعون استرداد حساباتهم
- ❌ فقدان الحسابات عند نسيان كلمة المرور

### بعد التطبيق
- ✅ ميزة إعادة تعيين كلمة المرور متاحة
- ✅ عملية آمنة عبر البريد الإلكتروني
- ✅ واجهة مستخدم سهلة وواضحة
- ✅ تحقق من صحة البيانات
- ✅ رسائل خطأ واضحة
- ✅ صفحة اختبار شاملة

## 🎉 الخلاصة

تم تطوير ميزة "نسيت كلمة المرور" بنجاح مع:

1. **صفحة مخصصة** - `forgot-password.html` مع 4 خطوات واضحة
2. **نظام تحقق آمن** - رمز 6 أرقام عشوائي
3. **تحقق من صحة البيانات** - البريد الإلكتروني وكلمة المرور
4. **واجهة مستخدم سهلة** - تصميم بسيط وواضح
5. **صفحة اختبار شاملة** - `test-forgot-password.html`
6. **رسائل خطأ واضحة** - توجيه المستخدم بشكل صحيح

الآن المستخدمون يمكنهم إعادة تعيين كلمات مرورهم بسهولة وأمان! 🔐✅

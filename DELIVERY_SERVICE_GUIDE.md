# دليل خدمة التوصيل - Delivery Service Guide

## الميزة الجديدة
تم إضافة خدمة التوصيل إلى صفحة `add-car.html` التي تسمح لمالك السيارة بتقديم خدمة توصيل السيارة إلى موقع الاستلام مع رسوم اختيارية.

## الملفات المحدثة

### 1. `add-car.html` (محدث)
- **إضافة قسم خدمة التوصيل**: بعد قسم التوفر
- **خيار تفعيل الخدمة**: checkbox لتفعيل خدمة التوصيل
- **حقل رسوم التوصيل**: input لرسوم التوصيل (اختياري)
- **حقل ملاحظات التوصيل**: textarea للملاحظات (اختياري)

### 2. `add-car.js` (محدث)
- **وظيفة toggleDeliveryFee**: لإظهار/إخفاء حقول التوصيل
- **تحديث form submission**: لتضمين بيانات التوصيل
- **تحديث draft loading**: لتحميل بيانات التوصيل من المسودة

### 3. `styles.css` (محدث)
- **تصميم قسم التوصيل**: CSS شامل
- **تصميم حقول التوصيل**: تنسيق للحقول الجديدة
- **تصميم متجاوب**: للجوال والأجهزة اللوحية

### 4. `test-delivery-service.html` (جديد)
- **صفحة اختبار شاملة**: لاختبار جميع وظائف التوصيل
- **أمثلة عملية**: أمثلة مختلفة لخدمة التوصيل
- **دليل الاستخدام**: تعليمات مفصلة

## الميزات المضافة

### 1. قسم خدمة التوصيل في النموذج
```html
<!-- Delivery Service -->
<div class="form-section">
    <h3><i class="fas fa-truck"></i> خدمة التوصيل</h3>
    <p class="section-description">اختر ما إذا كنت تريد تقديم خدمة توصيل السيارة إلى موقع الاستلام</p>
    
    <div class="form-group checkbox-group">
        <label class="checkbox-label">
            <input type="checkbox" id="deliveryService" name="deliveryService" onchange="toggleDeliveryFee()">
            <span class="checkmark"></span>
            <i class="fas fa-truck"></i>
            أقدم خدمة توصيل السيارة إلى موقع الاستلام
        </label>
    </div>
    
    <div class="form-group" id="deliveryFeeGroup" style="display: none;">
        <label for="deliveryFee">رسوم التوصيل</label>
        <div class="input-group">
            <i class="fas fa-coins"></i>
            <input type="number" id="deliveryFee" name="deliveryFee" placeholder="مثال: 50" min="0">
            <span class="input-suffix">ريال</span>
        </div>
        <small class="form-help">أدخل رسوم التوصيل (اختياري - إذا تركت فارغاً سيتم عرض "اتصل للمساومة")</small>
    </div>
    
    <div class="form-group" id="deliveryNoteGroup" style="display: none;">
        <label for="deliveryNote">ملاحظات التوصيل (اختياري)</label>
        <div class="input-group">
            <textarea id="deliveryNote" name="deliveryNote" rows="3" placeholder="مثال: التوصيل متاح في نطاق 20 كم من موقع السيارة، أو في أوقات محددة..."></textarea>
        </div>
    </div>
</div>
```

### 2. وظيفة تفعيل/إلغاء خدمة التوصيل
```javascript
// Delivery service toggle function
window.toggleDeliveryFee = function() {
    const deliveryService = document.getElementById('deliveryService');
    const deliveryFeeGroup = document.getElementById('deliveryFeeGroup');
    const deliveryNoteGroup = document.getElementById('deliveryNoteGroup');
    
    if (deliveryService.checked) {
        deliveryFeeGroup.style.display = 'block';
        deliveryNoteGroup.style.display = 'block';
    } else {
        deliveryFeeGroup.style.display = 'none';
        deliveryNoteGroup.style.display = 'none';
        // Clear the fields when unchecked
        document.getElementById('deliveryFee').value = '';
        document.getElementById('deliveryNote').value = '';
    }
};
```

### 3. تحديث بيانات السيارة
```javascript
// Create mock car data
const carData = {
    // ... existing car data ...
    
    // Delivery service data
    delivery_service: formData.get('deliveryService') === 'on',
    delivery_fee: formData.get('deliveryFee') ? parseFloat(formData.get('deliveryFee')) : null,
    delivery_note: formData.get('deliveryNote') || null,
    
    // ... rest of car data ...
};
```

## التصميم والواجهة

### 1. تصميم قسم التوصيل
```css
/* Form Help Text */
.form-help {
    font-size: 0.85rem;
    color: #666;
    margin-top: 5px;
    display: block;
}

/* Delivery Service Section */
.delivery-service-section {
    background: #f8f9ff;
    border: 1px solid #e3e8ff;
    border-radius: 8px;
    padding: 20px;
    margin-top: 15px;
}

.delivery-service-section .checkbox-label {
    font-weight: 600;
    color: #2c3e50;
}

.delivery-service-section .checkbox-label i {
    color: #667eea;
    margin-left: 8px;
}

#deliveryFeeGroup,
#deliveryNoteGroup {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
}

#deliveryFeeGroup .input-group {
    max-width: 200px;
}

#deliveryNoteGroup textarea {
    resize: vertical;
    min-height: 80px;
}
```

## الميزات التفاعلية

### 1. إدارة خدمة التوصيل
- **تفعيل الخدمة**: بالنقر على checkbox
- **إظهار/إخفاء الحقول**: تلقائياً عند التفعيل/الإلغاء
- **مسح البيانات**: تلقائياً عند إلغاء الخدمة

### 2. حقول التوصيل
- **رسوم التوصيل**: حقل رقمي اختياري
- **ملاحظات التوصيل**: حقل نصي اختياري
- **مساعدة المستخدم**: نصوص توضيحية

### 3. حفظ وتحميل البيانات
- **حفظ في المسودة**: مع باقي بيانات السيارة
- **تحميل من المسودة**: استعادة حالة التوصيل
- **حفظ نهائي**: مع بيانات السيارة في localStorage

## أنواع خدمة التوصيل

### 1. توصيل مع رسوم ثابتة
```javascript
{
    delivery_service: true,
    delivery_fee: 50,
    delivery_note: "التوصيل متاح في نطاق 30 كم من موقع السيارة"
}
```

### 2. توصيل مجاني
```javascript
{
    delivery_service: true,
    delivery_fee: 0,
    delivery_note: "التوصيل مجاني في نطاق 15 كم"
}
```

### 3. توصيل مع مساومة
```javascript
{
    delivery_service: true,
    delivery_fee: null,
    delivery_note: "التوصيل متاح حسب المسافة والوقت، يرجى الاتصال للتفاصيل"
}
```

### 4. توصيل في أوقات محددة
```javascript
{
    delivery_service: true,
    delivery_fee: 30,
    delivery_note: "التوصيل متاح من الساعة 8 صباحاً حتى 8 مساءً، أيام العمل فقط"
}
```

## كيفية الاختبار

### 1. اختبار الوظيفة الأساسية
1. **افتح `test-delivery-service.html`**
2. **اضغط على "اختبار إضافة سيارة"**
3. **املأ البيانات الأساسية للسيارة**
4. **انتقل إلى قسم "خدمة التوصيل"**

### 2. اختبار تفعيل الخدمة
1. **ضع علامة على "أقدم خدمة توصيل"**
2. **لاحظ ظهور حقول رسوم التوصيل والملاحظات**
3. **أدخل رسوم التوصيل (مثال: 50 ريال)**
4. **أدخل ملاحظات التوصيل**

### 3. اختبار إلغاء الخدمة
1. **ألغِ علامة "أقدم خدمة توصيل"**
2. **لاحظ إخفاء حقول التوصيل**
3. **لاحظ مسح البيانات تلقائياً**

### 4. اختبار حفظ المسودة
1. **فعّل خدمة التوصيل وأدخل البيانات**
2. **اضغط على "حفظ كمسودة"**
3. **أعد تحميل الصفحة**
4. **اضغط على "تحميل المسودة"**
5. **تحقق من استعادة بيانات التوصيل**

### 5. اختبار إضافة سيارة تجريبية
1. **اضغط على "إضافة سيارة تجريبية"**
2. **اضغط على "عرض البيانات التجريبية"**
3. **تحقق من وجود بيانات التوصيل**

## الفوائد

### 1. فوائد لمالك السيارة
- **مصدر دخل إضافي**: رسوم التوصيل
- **جذب المزيد من العملاء**: راحة أكثر للمستأجرين
- **تمييز السيارة**: ميزة إضافية تنافسية
- **مرونة في الخدمة**: تحديد الرسوم والشروط

### 2. فوائد للمستأجر
- **راحة أكبر**: لا حاجة للذهاب لموقع السيارة
- **توفير الوقت**: التوصيل إلى الموقع المطلوب
- **شفافية في التكلفة**: معرفة رسوم التوصيل مسبقاً
- **خيارات متعددة**: توصيل مجاني أو مدفوع

## نصائح للاستخدام

### 1. رسوم التوصيل
- **رسوم معقولة**: 20-100 ريال حسب المسافة
- **التوصيل المجاني**: لجذب المزيد من العملاء
- **اتصل للمساومة**: للمسافات البعيدة أو الأوقات الخاصة

### 2. ملاحظات التوصيل
- **تحديد النطاق**: المسافة المتاحة للتوصيل
- **تحديد الأوقات**: أوقات التوصيل المتاحة
- **الشروط الخاصة**: أي شروط إضافية

### 3. استراتيجيات التسويق
- **التوصيل المجاني**: لجذب العملاء الجدد
- **رسوم مخفضة**: للعودة المتكررة
- **خدمة متميزة**: للسيارات الفاخرة

## الخلاصة

تم إضافة خدمة التوصيل بنجاح:

1. ✅ **قسم التوصيل**: في نموذج إضافة السيارة
2. ✅ **خيار التفعيل**: checkbox لتفعيل الخدمة
3. ✅ **حقل الرسوم**: input لرسوم التوصيل
4. ✅ **حقل الملاحظات**: textarea للملاحظات
5. ✅ **تفاعل تلقائي**: إظهار/إخفاء الحقول
6. ✅ **حفظ البيانات**: في localStorage
7. ✅ **تحميل المسودة**: استعادة بيانات التوصيل
8. ✅ **تصميم متجاوب**: لجميع الأجهزة
9. ✅ **صفحة اختبار**: شاملة ومفصلة
10. ✅ **دليل شامل**: للاستخدام والاختبار

### النتيجة النهائية:
الآن يمكن لمالكي السيارات تقديم خدمة التوصيل مع رسوم اختيارية، مما يزيد من راحة المستأجرين ويوفر مصدر دخل إضافي للمالكين! 🚗✨

**للاختبار**: افتح `test-delivery-service.html` واختبر جميع ميزات خدمة التوصيل.

# دليل خريطة الحجوزات - Google Maps Integration

## الميزة الجديدة
تم إضافة خريطة تفاعلية لموقع الاستلام في صفحة `my-bookings.html` باستخدام Google Maps API.

## الملفات المحدثة

### 1. `my-bookings.html` (محدث)
- **إضافة Google Maps API**: `<script src="https://maps.googleapis.com/maps/api/js?key=...&libraries=places"></script>`

### 2. `my-bookings.js` (محدث)
- **دالة `initializePickupMap(location)`**: تهيئة الخريطة مع موقع الاستلام
- **دالة `getDirections(location)`**: فتح Google Maps للحصول على الاتجاهات
- **دالة `copyLocation(location)`**: نسخ العنوان للاستخدام
- **تحديث `viewBookingDetails()`**: إضافة قسم الخريطة في Modal التفاصيل

### 3. `styles.css` (محدث)
- **`.map-section`**: تنسيق قسم الخريطة
- **`.booking-map`**: تنسيق عنصر الخريطة
- **`.map-actions`**: تنسيق أزرار الخريطة
- **تنسيقات متجاوبة**: للجوال والأجهزة اللوحية

### 4. `test-booking-map.html` (جديد)
- **صفحة اختبار شاملة**: للخريطة وميزاتها
- **خريطة تجريبية**: لعرض الميزات
- **أزرار اختبار**: لإضافة بيانات تجريبية

## الميزات المضافة

### 1. خريطة تفاعلية
```javascript
function initializePickupMap(location) {
    // تهيئة الخريطة مع Google Maps API
    const map = new google.maps.Map(mapElement, {
        center: { lat: defaultLat, lng: defaultLng },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
    });
}
```

### 2. علامة موقع الاستلام
```javascript
const marker = new google.maps.Marker({
    position: { lat: defaultLat, lng: defaultLng },
    map: map,
    title: 'موقع الاستلام',
    icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new google.maps.Size(32, 32)
    }
});
```

### 3. نافذة معلومات
```javascript
const infoWindow = new google.maps.InfoWindow({
    content: `
        <div style="text-align: center; font-family: 'Cairo', sans-serif;">
            <h4 style="margin: 0 0 5px 0; color: #333;">موقع الاستلام</h4>
            <p style="margin: 0; color: #666; font-size: 14px;">${location}</p>
        </div>
    `
});
```

### 4. الحصول على الاتجاهات
```javascript
function getDirections(location) {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location + ', Saudi Arabia')}`;
    window.open(directionsUrl, '_blank');
}
```

### 5. نسخ العنوان
```javascript
function copyLocation(location) {
    navigator.clipboard.writeText(location).then(() => {
        showMessage('تم نسخ العنوان بنجاح', 'success');
    });
}
```

## التصميم والواجهة

### 1. قسم الخريطة في Modal
```html
<div class="map-section">
    <h4>خريطة موقع الاستلام</h4>
    <div id="pickupMap" class="booking-map"></div>
    <div class="map-actions">
        <button class="btn btn-outline" onclick="getDirections('${pickupLocation}')">
            <i class="fas fa-directions"></i>
            الحصول على الاتجاهات
        </button>
        <button class="btn btn-outline" onclick="copyLocation('${pickupLocation}')">
            <i class="fas fa-copy"></i>
            نسخ العنوان
        </button>
    </div>
</div>
```

### 2. تنسيقات CSS
```css
.map-section {
    margin-top: 1.5rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 12px;
    border: 1px solid #e9ecef;
}

.booking-map {
    width: 100%;
    height: 300px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
}
```

## المواقع التجريبية

### 1. مواقع الاستلام في الحجوزات التجريبية:
- **مطار الملك خالد الدولي** - الرياض
- **فندق الشرق** - الدمام
- **مركز المدينة التجاري** - الرياض
- **مطار الملك فهد الدولي** - الدمام

### 2. إحداثيات افتراضية:
```javascript
// Default coordinates for Saudi Arabia
let defaultLat = 24.7136;  // Riyadh
let defaultLng = 46.6753;  // Riyadh
```

## كيفية الاختبار

### 1. اختبار صفحة الاختبار
1. افتح `test-booking-map.html`
2. اقرأ الميزات الجديدة
3. اضغط على "إضافة حجوزات تجريبية"
4. اضغط على "اختبار صفحة الحجوزات"

### 2. اختبار الخريطة في الصفحة الفعلية
1. **افتح صفحة الحجوزات**: `my-bookings.html`
2. **اضغط على "عرض التفاصيل"**: لأي حجز
3. **ابحث عن قسم الخريطة**: تحت معلومات الاستلام والإرجاع
4. **اختبر الميزات**:
   - اضغط على العلامة في الخريطة
   - اضغط على "الحصول على الاتجاهات"
   - اضغط على "نسخ العنوان"

### 3. اختبار ميزات الخريطة
1. **الخريطة التفاعلية**: تحريك، تكبير، تصغير
2. **العلامة**: اضغط عليها لرؤية المعلومات
3. **أزرار التحكم**: تغيير نوع الخريطة، Street View
4. **الاتجاهات**: فتح Google Maps في تبويب جديد
5. **نسخ العنوان**: نسخ العنوان للحافظة

## معالجة الأخطاء

### 1. خطأ في تحميل الخريطة
```javascript
} catch (error) {
    console.error('Error initializing map:', error);
    const mapElement = document.getElementById('pickupMap');
    if (mapElement) {
        mapElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 200px; background: #f8f9fa; border-radius: 8px; color: #666;">
                <div style="text-align: center;">
                    <i class="fas fa-map-marker-alt" style="font-size: 2rem; margin-bottom: 10px; color: #999;"></i>
                    <p>لا يمكن تحميل الخريطة</p>
                    <small>${location}</small>
                </div>
            </div>
        `;
    }
}
```

### 2. خطأ في نسخ العنوان
```javascript
} catch (error) {
    console.error('Error copying location:', error);
    showMessage('حدث خطأ في نسخ العنوان', 'error');
}
```

## التصميم المتجاوب

### 1. للشاشات الكبيرة
- **ارتفاع الخريطة**: 300px
- **أزرار أفقية**: جنباً إلى جنب

### 2. للجوال والأجهزة اللوحية
```css
@media (max-width: 768px) {
    .booking-map {
        height: 250px;
    }
    
    .map-actions {
        flex-direction: column;
    }
    
    .map-actions .btn {
        width: 100%;
        text-align: center;
    }
}
```

## الفوائد

### 1. تجربة مستخدم محسنة
- **رؤية واضحة**: لموقع الاستلام
- **سهولة الوصول**: للحصول على الاتجاهات
- **معلومات دقيقة**: عن الموقع

### 2. وظائف مفيدة
- **الحصول على الاتجاهات**: مباشرة من Google Maps
- **نسخ العنوان**: للاستخدام في تطبيقات أخرى
- **عرض تفاصيل الموقع**: عند الضغط على العلامة

### 3. تصميم احترافي
- **واجهة أنيقة**: تتناسق مع التصميم العام
- **استجابة جيدة**: لجميع أحجام الشاشات
- **سهولة الاستخدام**: أزرار واضحة ومفهومة

## الأمان والخصوصية

### 1. Google Maps API Key
- **مفتاح آمن**: للاستخدام في التطبيق
- **قيود الاستخدام**: مناسبة للتطوير والاختبار
- **حماية البيانات**: لا يتم تخزين معلومات حساسة

### 2. معالجة البيانات
- **Geocoding آمن**: لتحويل العناوين إلى إحداثيات
- **عدم حفظ الإحداثيات**: يتم حسابها عند الحاجة فقط
- **حماية الخصوصية**: لا يتم تتبع مواقع المستخدمين

## الخلاصة

تم إضافة خريطة تفاعلية شاملة لصفحة الحجوزات:

1. ✅ **خريطة تفاعلية**: باستخدام Google Maps API
2. ✅ **علامة موقع الاستلام**: مع معلومات مفصلة
3. ✅ **الحصول على الاتجاهات**: فتح Google Maps مباشرة
4. ✅ **نسخ العنوان**: للاستخدام في تطبيقات أخرى
5. ✅ **تصميم متجاوب**: لجميع أحجام الشاشات
6. ✅ **معالجة الأخطاء**: وعرض رسائل مناسبة
7. ✅ **صفحة اختبار شاملة**: لاختبار جميع الميزات

### النتيجة النهائية:
الآن صفحة الحجوزات تحتوي على خريطة تفاعلية تساعد المستخدمين على تحديد موقع الاستلام بسهولة! 🗺️✨

**للاختبار**: افتح `test-booking-map.html` واختبر جميع ميزات الخريطة.

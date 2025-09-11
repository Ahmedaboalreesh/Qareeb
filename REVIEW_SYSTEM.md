# نظام التقييمات - منصة شارك سيارتك

## 📋 نظرة عامة

نظام التقييمات الشامل في منصة شارك سيارتك يتيح للمستخدمين تقييم تجربتهم مع السيارات والمالكين، مما يساعد في بناء مجتمع موثوق وشفاف.

## 🎯 المميزات الرئيسية

### ✅ تقييم شامل
- **التقييم العام**: من 1 إلى 5 نجوم
- **تقييمات مفصلة**: النظافة، حالة السيارة، التواصل مع المالك
- **التعليقات**: إمكانية كتابة تعليقات مفصلة (حتى 500 حرف)

### ✅ أنواع التقييمات
- **مستأجر للمالك**: تقييم المستأجر للسيارة والمالك
- **مالك للمستأجر**: تقييم المالك للمستأجر (قيد التطوير)

### ✅ إدارة التقييمات
- عرض جميع التقييمات المقدمة والمستلمة
- إحصائيات شاملة للتقييمات
- إمكانية تعديل وحذف التقييمات
- تصفية التقييمات حسب النوع

## 🗄️ هيكل قاعدة البيانات

### جدول التقييمات (reviews)
```json
{
  "review_id": {
    "id": "string",
    "booking_id": "string",
    "car_id": "string",
    "renter_id": "string",
    "owner_id": "string",
    "rating": "number (1-5)",
    "cleanliness_rating": "number (1-5)",
    "condition_rating": "number (1-5)",
    "communication_rating": "number (1-5)",
    "comment": "string",
    "review_type": "renter_to_owner | owner_to_renter",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

## 🔌 API Endpoints

### إنشاء تقييم جديد
```http
POST /api/reviews
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "booking_id": "booking-id",
  "car_id": "car-id",
  "rating": 5,
  "cleanliness_rating": 5,
  "condition_rating": 4,
  "communication_rating": 5,
  "comment": "تجربة ممتازة",
  "review_type": "renter_to_owner"
}
```

### الحصول على تقييمات السيارة
```http
GET /api/cars/{carId}/reviews
Authorization: Bearer <jwt-token>
```

### الحصول على تقييمات المستخدم
```http
GET /api/reviews/user?type=given
Authorization: Bearer <jwt-token>
```

### تحديث تقييم
```http
PUT /api/reviews/{reviewId}
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "rating": 4,
  "comment": "تقييم محدث"
}
```

### حذف تقييم
```http
DELETE /api/reviews/{reviewId}
Authorization: Bearer <jwt-token>
```

## 📱 واجهات المستخدم

### 1. صفحة إضافة التقييم (`add-review.html`)
- **الوصف**: صفحة مخصصة لإضافة تقييم جديد بعد انتهاء الحجز
- **المميزات**:
  - عرض معلومات الحجز
  - تقييم بالنجوم (تفاعلي)
  - تقييمات مفصلة
  - حقل التعليقات مع عداد الأحرف
  - تحقق من صحة البيانات

### 2. صفحة التقييمات (`reviews.html`)
- **الوصف**: صفحة لإدارة جميع التقييمات
- **المميزات**:
  - إحصائيات شاملة
  - تصفية التقييمات
  - عرض التقييمات بتصميم جميل
  - إمكانية التعديل والحذف

### 3. عرض التقييمات في تفاصيل السيارة
- **الوصف**: عرض التقييمات في صفحة تفاصيل السيارة
- **المميزات**:
  - متوسط التقييم
  - قائمة التقييمات
  - تصنيف التقييمات

## 🎨 التصميم والأنماط

### نظام التقييم بالنجوم
```css
.stars i {
    font-size: 1.5rem;
    color: #ddd;
    cursor: pointer;
    transition: all 0.2s ease;
}

.stars i.fas.text-warning {
    color: #ffc107;
}
```

### بطاقات التقييم
```css
.review-item {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### الإحصائيات
```css
.review-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}
```

## 🔒 الأمان والتحقق

### التحقق من الصلاحيات
- التحقق من أن المستخدم هو صاحب التقييم
- التحقق من أن الحجز مكتمل قبل التقييم
- منع التقييمات المكررة لنفس الحجز

### التحقق من البيانات
```javascript
// التحقق من التقييم
if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
}

// التحقق من عدم وجود تقييم مسبق
const existingReviews = await db.getReviewByBookingId(booking_id);
const existingReview = existingReviews.find(review => review.review_type === review_type);
if (existingReview) {
    return res.status(400).json({ error: 'Review already exists for this booking' });
}
```

## 📊 الإحصائيات والحسابات

### متوسط التقييم
```javascript
const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
```

### توزيع التقييمات
```javascript
const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
reviews.forEach(review => {
    ratingBreakdown[review.rating]++;
});
```

## 🧪 الاختبار

### تشغيل اختبارات التقييمات
```bash
npm run test-reviews
```

### اختبارات شاملة
- إنشاء تقييم جديد
- قراءة التقييمات
- حساب متوسط التقييم
- تصفية التقييمات
- حذف التقييمات

## 🚀 الاستخدام

### إضافة تقييم جديد
1. انتقل إلى صفحة "حجوزاتي"
2. اختر حجز مكتمل
3. اضغط على "إضافة تقييم"
4. املأ النموذج وأرسل التقييم

### عرض التقييمات
1. انتقل إلى صفحة "التقييمات"
2. استخدم التصفية لعرض التقييمات المطلوبة
3. يمكنك تعديل أو حذف تقييماتك

### عرض تقييمات السيارة
1. انتقل إلى صفحة تفاصيل السيارة
2. ابحث عن قسم "التقييمات"
3. شاهد متوسط التقييم والتقييمات التفصيلية

## 🔄 التطوير المستقبلي

### الميزات المخططة
- [ ] تقييم المالك للمستأجر
- [ ] ردود على التقييمات
- [ ] صور في التقييمات
- [ ] نظام المكافآت للتقييمات
- [ ] تقارير التقييمات المشبوهة
- [ ] تصفية التقييمات حسب التاريخ
- [ ] تصدير تقارير التقييمات

### التحسينات التقنية
- [ ] تخزين مؤقت للتقييمات
- [ ] تحديثات فورية للتقييمات
- [ ] إشعارات للتقييمات الجديدة
- [ ] تحليل مشاعر التعليقات

## 📞 الدعم

للاستفسارات حول نظام التقييمات أو الإبلاغ عن مشاكل، يرجى التواصل مع فريق التطوير.

---

**نظام التقييمات** - بناء مجتمع موثوق وشفاف في منصة شارك سيارتك

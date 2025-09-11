# نظام الإشعارات - منصة تأجير السيارات

## نظرة عامة

تم إضافة نظام إشعارات شامل لإرسال إشعارات لمالك السيارة عند رفع الصور من قبل المستأجر، بالإضافة إلى أنواع أخرى من الإشعارات.

## الميزات الرئيسية

### 🔔 أنواع الإشعارات المدعومة

1. **رفع الصور** (`photo_uploaded`)
   - يتم إرسالها لمالك السيارة عند رفع المستأجر للصور
   - تحتوي على تفاصيل المستأجر والسيارة

2. **تحديث حالة الحجز** (`booking_status_updated`)
   - إشعارات حول تغيير حالة الحجز (موافقة، رفض، إكمال)

3. **التقييمات** (`review_received`)
   - إشعارات عند استلام تقييم جديد

4. **الحجوزات الجديدة** (`booking_created`)
   - إشعارات عند إنشاء حجز جديد

5. **الدفع** (`payment_received`)
   - إشعارات حول استلام الدفع

### 📱 واجهة المستخدم

- **صفحة الإشعارات** (`notifications.html`)
- **شارة الإشعارات** في جميع الصفحات
- **فلترة الإشعارات** حسب النوع والحالة
- **تحديد كمقروء** للإشعارات الفردية والجماعية
- **حذف الإشعارات**

## البنية التقنية

### قاعدة البيانات (Firebase Realtime Database)

```json
{
  "notifications": {
    "notificationId1": {
      "id": "notificationId1",
      "user_id": "userId",
      "type": "photo_uploaded",
      "title": "تم رفع صور جديدة للحجز",
      "description": "قام أحمد محمد برفع صور جديدة لحجز سيارة تويوتا كامري 2023",
      "related_id": "bookingId",
      "related_type": "booking",
      "is_read": false,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### API Endpoints

#### 1. الحصول على الإشعارات
```http
GET /api/notifications?limit=20&offset=0
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "notificationId",
      "user_id": "userId",
      "type": "photo_uploaded",
      "title": "تم رفع صور جديدة للحجز",
      "description": "قام أحمد محمد برفع صور جديدة...",
      "related_id": "bookingId",
      "related_type": "booking",
      "is_read": false,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 2. عدد الإشعارات غير المقروءة
```http
GET /api/notifications/unread-count
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 5
}
```

#### 3. تحديد إشعار كمقروء
```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

#### 4. تحديد جميع الإشعارات كمقروءة
```http
PUT /api/notifications/mark-all-read
Authorization: Bearer <token>
```

#### 5. حذف إشعار
```http
DELETE /api/notifications/:id
Authorization: Bearer <token>
```

### دوال قاعدة البيانات

#### إنشاء إشعار
```javascript
async createNotification(notificationData) {
  // Creates a new notification in Firebase
}
```

#### الحصول على إشعارات المستخدم
```javascript
async getNotificationsByUserId(userId, limit = 20) {
  // Retrieves notifications for a specific user
}
```

#### عدد الإشعارات غير المقروءة
```javascript
async getUnreadNotificationsCount(userId) {
  // Returns count of unread notifications
}
```

#### تحديد كمقروء
```javascript
async markNotificationAsRead(notificationId) {
  // Marks a single notification as read
}

async markAllNotificationsAsRead(userId) {
  // Marks all user notifications as read
}
```

## آلية عمل إشعارات رفع الصور

### 1. عند رفع الصور
```javascript
// في دالة saveBookingPhoto
await this.createPhotoUploadNotification(bookingId, photo);
```

### 2. إنشاء الإشعار
```javascript
async createPhotoUploadNotification(bookingId, photo) {
  // 1. الحصول على تفاصيل الحجز
  const booking = await this.getBookingById(bookingId);
  
  // 2. الحصول على تفاصيل السيارة
  const car = await this.getCarById(booking.car_id);
  
  // 3. الحصول على تفاصيل المستأجر
  const renter = await this.getUserById(booking.renter_id);
  
  // 4. إنشاء الإشعار لمالك السيارة
  const notificationData = {
    user_id: booking.owner_id,
    type: 'photo_uploaded',
    title: 'تم رفع صور جديدة للحجز',
    description: `قام ${renter.full_name} برفع صور جديدة لحجز سيارة ${car.brand} ${car.model} ${car.year}`,
    related_id: bookingId,
    related_type: 'booking'
  };
  
  await this.createNotification(notificationData);
}
```

## واجهة المستخدم

### صفحة الإشعارات
- **العنوان**: `notifications.html`
- **الملف المساعد**: `notifications.js`
- **التصميم**: `styles.css`

### الميزات
1. **عرض الإشعارات** مع أيقونات مختلفة حسب النوع
2. **فلترة الإشعارات** (الكل، غير مقروءة، حسب النوع)
3. **تحديد كمقروء** (فردي أو جماعي)
4. **حذف الإشعارات**
5. **تحميل المزيد** من الإشعارات
6. **شارة الإشعارات** في جميع الصفحات

### شارة الإشعارات
```html
<a href="notifications.html">
    <i class="fas fa-bell"></i>
    الإشعارات
    <span class="notification-badge" id="notificationBadge" style="display: none;">0</span>
</a>
```

## الاختبار

### تشغيل اختبارات النظام
```bash
npm run test-notifications
```

### اختبارات شاملة
1. **إنشاء الإشعارات**
2. **الحصول على الإشعارات**
3. **تحديد كمقروء**
4. **حساب الإشعارات غير المقروءة**
5. **إشعارات رفع الصور**

## الأمان والصلاحيات

### التحقق من الصلاحيات
- جميع API endpoints تتطلب مصادقة JWT
- المستخدم يمكنه الوصول فقط لإشعاراته الخاصة
- التحقق من ملكية الإشعار قبل التحديث أو الحذف

### حماية البيانات
- لا يتم تخزين معلومات حساسة في الإشعارات
- استخدام معرفات مرجعية للبيانات المرتبطة
- تشفير البيانات في النقل

## الأداء والتحسين

### تحسينات قاعدة البيانات
- **فهرسة** على `user_id` للاستعلامات السريعة
- **ترتيب** حسب `created_at` للإشعارات الأحدث
- **حد** على عدد الإشعارات المحملة

### تحسينات الواجهة
- **تحميل تدريجي** للإشعارات
- **تحديث فوري** لشارة الإشعارات
- **تخزين مؤقت** للبيانات المحلية

## التطوير المستقبلي

### ميزات مقترحة
1. **إشعارات فورية** (WebSocket/Push Notifications)
2. **إعدادات الإشعارات** (تفضيلات المستخدم)
3. **إشعارات البريد الإلكتروني**
4. **إشعارات SMS**
5. **جدولة الإشعارات**

### تحسينات تقنية
1. **WebSocket** للاتصال المباشر
2. **Service Workers** للإشعارات في المتصفح
3. **Firebase Cloud Messaging** للإشعارات الفورية
4. **تحليلات الإشعارات** (معدل الفتح، التفاعل)

## استكشاف الأخطاء

### مشاكل شائعة

#### 1. عدم ظهور الإشعارات
- تحقق من وجود token صالح
- تحقق من اتصال Firebase
- تحقق من console للأخطاء

#### 2. عدم تحديث شارة الإشعارات
- تحقق من دالة `updateNotificationBadge()`
- تحقق من وجود عنصر `notificationBadge`
- تحقق من استجابة API

#### 3. عدم إنشاء إشعارات رفع الصور
- تحقق من وجود بيانات الحجز والسيارة والمستخدم
- تحقق من console للأخطاء في `createPhotoUploadNotification`
- تحقق من صلاحيات Firebase

### سجلات التصحيح
```javascript
// تفعيل سجلات مفصلة
console.log('Photo upload notification created for car owner:', booking.owner_id);
console.error('Error creating photo upload notification:', error);
```

## الخلاصة

تم تطوير نظام إشعارات شامل ومتكامل يوفر:

✅ **إشعارات تلقائية** عند رفع الصور  
✅ **واجهة مستخدم بديهية** لإدارة الإشعارات  
✅ **API قوي وآمن** للتعامل مع الإشعارات  
✅ **أداء محسن** مع Firebase Realtime Database  
✅ **اختبارات شاملة** لضمان الجودة  
✅ **توثيق مفصل** للتطوير والصيانة  

النظام جاهز للاستخدام ويمكن توسيعه بسهولة لإضافة أنواع جديدة من الإشعارات والميزات المتقدمة.

# 📦 دليل التثبيت - منصة تأجير السيارات

## 🔧 تثبيت Node.js

### Windows
1. اذهب إلى [nodejs.org](https://nodejs.org)
2. حمل الإصدار LTS (الأحدث والأكثر استقراراً)
3. شغل ملف التثبيت واتبع التعليمات
4. تأكد من التثبيت:
   ```bash
   node --version
   npm --version
   ```

### macOS
```bash
# باستخدام Homebrew
brew install node

# أو حمل من الموقع الرسمي
# https://nodejs.org
```

### Linux (Ubuntu/Debian)
```bash
# تحديث النظام
sudo apt update

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# تأكد من التثبيت
node --version
npm --version
```

## 🚀 تثبيت المشروع

### 1. تثبيت التبعيات
```bash
npm install
```

### 2. إنشاء ملف البيئة
```bash
# أنشئ ملف .env في مجلد المشروع
echo "PORT=3000" > .env
echo "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" >> .env
```

### 3. تهيئة قاعدة البيانات
```bash
npm run init-db
```

### 4. تشغيل الخادم
```bash
npm start
```

## 🔍 استكشاف مشاكل التثبيت

### مشكلة: "npm is not recognized"
- تأكد من تثبيت Node.js بشكل صحيح
- أعد تشغيل Terminal/Command Prompt
- تأكد من إضافة Node.js إلى PATH

### مشكلة: "Permission denied"
```bash
# Windows: شغل Command Prompt كمدير
# Linux/macOS:
sudo npm install
```

### مشكلة: "Port already in use"
```bash
# غيّر المنفذ في ملف .env
PORT=3001
```

## 📋 متطلبات النظام

### الحد الأدنى
- **RAM**: 512 MB
- **Storage**: 100 MB
- **OS**: Windows 10, macOS 10.14, Ubuntu 18.04

### الموصى به
- **RAM**: 2 GB أو أكثر
- **Storage**: 1 GB أو أكثر
- **OS**: أحدث إصدار

## 🔐 إعدادات الأمان

### تغيير JWT Secret
```bash
# في ملف .env
JWT_SECRET=your-very-long-and-random-secret-key
```

### إعدادات الإنتاج
```bash
# في ملف .env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-production-secret-key
```

## 📊 قاعدة البيانات

### SQLite (افتراضي)
- لا يحتاج تثبيت إضافي
- ملف قاعدة البيانات: `database/data/car_rental.db`

### MySQL (اختياري)
```bash
# تثبيت MySQL
# تحديث إعدادات قاعدة البيانات في database/db.js
```

## 🎯 اختبار التثبيت

### 1. تشغيل الخادم
```bash
npm start
```

### 2. فتح المتصفح
اذهب إلى: `http://localhost:3000`

### 3. تسجيل مستخدم جديد
- املأ نموذج التسجيل
- تأكد من إنشاء الحساب بنجاح

### 4. إضافة سيارة
- املأ نموذج إضافة السيارة
- ارفع صور
- تأكد من حفظ البيانات

## 📞 الدعم

إذا واجهت أي مشاكل:

1. تأكد من تثبيت Node.js بشكل صحيح
2. تأكد من تثبيت جميع التبعيات
3. تحقق من ملفات السجل
4. راجع ملف `SETUP.md` للمزيد من التفاصيل

---

**شارك سيارتك** - دعم الاقتصاد التشاركي في المملكة العربية السعودية | رؤية 2030

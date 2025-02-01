const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // استيراد مكتبة path

const app = express();
const PORT = 5000;

// تفعيل CORS للسماح بالوصول من أجهزة أخرى
app.use(cors());

// تفعيل Body Parser لاستقبال البيانات بصيغة JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 📌 جعل مجلد "public" متاحًا ليتمكن المتصفح من فتح الملفات داخله
app.use(express.static(path.join(__dirname, 'public')));

// مصفوفة لتخزين الطلبات مؤقتًا
let orders = [];

// ✅ API: إرسال طلب جديد
app.post('/api/orders', (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'يجب إدخال عنوان ووصف الطلب' });
    }

    const newOrder = {
        id: orders.length + 1,
        title,
        description,
        status: 'جديد',
        createdAt: new Date()
    };

    orders.push(newOrder);
    res.status(201).json({ message: '✅ تم إرسال الطلب بنجاح', order: newOrder });
});

// ✅ API: الحصول على جميع الطلبات
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// 📌 أي طلب غير معروف يتم إعادة توجيهه إلى الصفحة الرئيسية (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل على: http://localhost:${PORT}`);
});
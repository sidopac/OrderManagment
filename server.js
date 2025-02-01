const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// استقبال الطلبات عبر WebSocket
wss.on("connection", (ws) => {
    console.log("🔗 متصل عبر WebSocket");

    ws.on("message", (message) => {
        console.log("📩 طلب جديد:", message.toString());

        // إرسال الطلب إلى جميع المتصلين
        wss.clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(message.toString());
            }
        });
    });

    ws.on("close", () => console.log("🚫 تم قطع الاتصال"));
});

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

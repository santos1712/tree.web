# tree-messages - موقع إرسال رسائل المناسبات

## 🔧 إعداد Cloudflare Workers
1. تأكد إن عندك Cloudflare Worker منشور اسمه tree-messages
2. اربط الـ KV Namespace باسم: MESSAGES_KV
3. استخدم الأمر:
   npx wrangler deploy

## 🧪 نقاط النهاية في الـ API:

- إنشاء مناسبة: `POST /create`
  ```json
  { "name": "Marwan", "occasion": "عيد ميلاد", "date": "2025-07-30" }
  ```

- إرسال رسالة: `POST /send?id=xxxxx`
  ```json
  { "name": "Ali", "message": "كل سنة وانت طيب", "paid": false }
  ```

- عرض الرسائل: `GET /view?id=xxxxx` (في يوم المناسبة فقط)
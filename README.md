# Math Teacher Website (Next.js App Router)

เว็บไซต์รายวิชาคณิตศาสตร์ ม.3 สำหรับนักเรียน ผู้ปกครอง และครูผู้สอน

## Features (Current)

- หน้าเว็บหลักครบ: Home, About, Lessons, Documents, News, Contact, Admin
- บทเรียนแบบ dynamic route: `/lessons/[id]`
- ฟอร์มติดต่อผ่าน API: `POST /api/contact`
- โครงอัปโหลดเอกสารสำหรับครูผ่าน API: `POST /api/admin/documents`
- หน้าเอกสารรองรับข้อมูลจาก Supabase และ fallback ไป mock data อัตโนมัติ

## Run Project

```bash
npm install
npm run dev
```

## Supabase Setup (Phase B Scaffold)

1. คัดลอก env

```bash
cp .env.example .env.local
```

1. กำหนดค่าใน `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
ADMIN_SESSION_SECRET=LONG_RANDOM_SECRET
```

1. รัน SQL schema

- เปิด Supabase SQL Editor
- วาง SQL จากไฟล์ `supabase/schema.sql`
- วาง SQL จากไฟล์ `supabase/announcements.sql`
- วาง SQL จากไฟล์ `supabase/lessons.sql`
- Execute

หมายเหตุ: หากเคยรัน SQL ไปแล้วก่อนหน้านี้ ให้รัน `supabase/lessons.sql` อีกครั้ง
เพื่อเพิ่มความสัมพันธ์ `documents.lesson_id -> lessons.id`

1. สร้าง Storage bucket

- ชื่อ bucket: `assignments`
- ตั้งให้ public read (นักเรียนเปิดดูไฟล์ได้โดยไม่ล็อกอิน)

## Data Flow

- ครูเข้าสู่ระบบที่ `/admin/login` ก่อนเข้าหน้า `/admin`
- ครูอัปโหลดไฟล์ที่หน้า `/admin`
- ครูเพิ่มประกาศได้ที่หน้า `/admin`
- ครูเพิ่ม/แก้ไข/ลบบทเรียนได้ที่หน้า `/admin`
- ครูแนบเอกสารประกอบไปพร้อมกับการสร้างบทเรียนได้
- API `POST /api/admin/documents` อัปโหลดไฟล์เข้า Supabase Storage
- API `DELETE /api/admin/documents/:id` ลบไฟล์จาก Supabase Storage และลบ metadata
- API `POST /api/admin/announcements` เพิ่มประกาศใหม่
- API `POST /api/admin/lessons` เพิ่มบทเรียน
- API `PATCH /api/admin/lessons/:id` แก้ไขบทเรียน
- API `DELETE /api/admin/lessons/:id` ลบบทเรียน
- API บันทึก metadata ลงตาราง `documents`
- เอกสารที่แนบจากฟอร์มบทเรียนจะถูกผูกกับ `lessonId` อัตโนมัติ
- หน้า `/documents` ดึงข้อมูลจาก Supabase มาแสดงให้นักเรียนดูได้ทันที
- หน้า `/news` ดึงประกาศที่อยู่ในช่วงเวลาแสดงผล พร้อมเรียงปักหมุดก่อนเสมอ
- หน้า `/lessons` และ `/lessons/[id]` ดึงข้อมูลจาก Supabase และ fallback เป็น mock data อัตโนมัติ

## Notes

- endpoint อัปโหลดเอกสารถูกป้องกันด้วย admin session cookie แล้ว
- แนะนำให้ rotate secrets เป็นระยะ และตั้ง `ADMIN_SESSION_SECRET` ให้ยาวและสุ่ม
- หาก deploy บน Vercel การอัปโหลดผ่าน route handler ควรจำกัดไฟล์ไม่เกิน `4 MB` เพื่อไม่ชน request body limit ของ Vercel Functions

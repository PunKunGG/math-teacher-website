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

2. กำหนดค่าใน `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
ADMIN_SESSION_SECRET=LONG_RANDOM_SECRET
```

3. รัน SQL schema

- เปิด Supabase SQL Editor
- วาง SQL จากไฟล์ `supabase/schema.sql`
- Execute

4. สร้าง Storage bucket

- ชื่อ bucket: `assignments`
- ตั้งให้ public read (นักเรียนเปิดดูไฟล์ได้โดยไม่ล็อกอิน)

## Data Flow

- ครูเข้าสู่ระบบที่ `/admin/login` ก่อนเข้าหน้า `/admin`
- ครูอัปโหลดไฟล์ที่หน้า `/admin`
- API `POST /api/admin/documents` อัปโหลดไฟล์เข้า Supabase Storage
- API `DELETE /api/admin/documents/:id` ลบไฟล์จาก Supabase Storage และลบ metadata
- API บันทึก metadata ลงตาราง `documents`
- หน้า `/documents` ดึงข้อมูลจาก Supabase มาแสดงให้นักเรียนดูได้ทันที

## Notes

- endpoint อัปโหลดเอกสารถูกป้องกันด้วย admin session cookie แล้ว
- แนะนำให้ rotate secrets เป็นระยะ และตั้ง `ADMIN_SESSION_SECRET` ให้ยาวและสุ่ม

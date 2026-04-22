#  OX GAME 3D 

<div align="center">
  <kbd>
    <img src="ox-game-3d/public/mainpage.png" alt="Hero Image" width="800">
  </kbd>
  <br>
  <em>สัมผัสประสบการณ์เกม OX แบบ 3D  การออกแบบนี้เพื่อการทดสอบเท่านั้น</em>
</div>

---

## TECH STACK & ARCHITECTURE
โปรเจกต์นี้ถูกสร้างขึ้นด้วยเทคโนโลยีที่ทันสมัย เพื่อความลื่นไหลและประสิทธิภาพสูงสุด:

- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- **3D Engine:** [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Cyberpunk Theme)
- **Database:** [SQL Server](https://www.microsoft.com/sql-server) + [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Social & Guest Login)
- **State:** [Zustand](https://github.com/pmndrs/zustand)

ยังสามารถปรับแต่งการเชื่อมต่อฐานข้อมูลได้ตามความเหมาะสม และสามารถปรับระดับความเก่งของ AI ได้ตามความเหมาะสม
---

## FULL SHOWCASE GALLERY

### Entry & Initialization
เริ่มการล็อกอินของคุณด้วยระบบรักษาความปลอดภัยและการเข้าถึงที่หลากหลาย

<kbd>
  <img src="ox-game-3d/public/loginpage.png" width="800" alt="Login Page">
</kbd>
<br>
<em>หน้าจอการตรวจสอบสิทธิ์ (Authorization )</em>

### The Arena (Gameplay)
กระดาน OX 3D ที่ตอบสนองแบบ Real-time พร้อม Minimax AI

<kbd>
  <img src="ox-game-3d/public/Playgame.png" width="400" alt="Gameplay 1">
</kbd>
<kbd>
  <img src="ox-game-3d/public/play.png" width="400" alt="Gameplay 2">
</kbd>
<br>
<kbd>
  <img src="ox-game-3d/public/afterplay.png" width="800" alt="Match Result">
</kbd>
<br>
<em>บรรยากาศช่วงเวลาเล่นและการสรุปผลการเล่น</em>

### Social & Statistics
เปรียบเทียบคะแนนกับผู้เล่นคนอื่นและตรวจสอบประวัติการเล่นส่วนตัว

<kbd>
  <img src="ox-game-3d/public/leaderboard.png" width="400" alt="Leaderboard">
</kbd>
<kbd>
  <img src="ox-game-3d/public/status.png" width="400" alt="Personal Status">
</kbd>
<br>
<em>ตารางอันดับ (Leaderboard) และ บันทึกสถิติส่วนบุคคล (Chronicles)</em>

### Admin Command Center (Root Access)
ระบบควบคุมศูนย์กลางสำหรับแอดมินเท่านั้น เพื่อความเป็นระเบียบเรียบร้อยของระบบ

<kbd>
  <img src="ox-game-3d/public/admincenter.png" width="800" alt="Admin Core">
</kbd>
<br>
<kbd>
  <img src="ox-game-3d/public/DashBoardadmin.png" width="400" alt="Admin Dashboard">
</kbd>
<kbd>
  <img src="ox-game-3d/public/Historyadmin.png" width="400" alt="Match Logs">
</kbd>
<br>
<em>Dashboard วิเคราะห์ระบบ และ ระบบตรวจสอบประวัติการเล่นรายบุคคล</em>

---

## FEATURE BREAKDOWN

### For Players (ระบบผู้เล่น)
- **Multi-Login:** รองรับ Google, GitHub และ Guest Mode
- **3D Immersion:** ฉากหลังและตัวกระดานเป็น 3D เต็มรูปแบบ
- **Dynamic Scoring:** ชนะได้คะแนน, แพ้เสียคะแนน, ชนะต่อเนื่อง (Streak) ได้โบนัส!
- **History Portal:** ดูประวัติการเล่นย้อนหลังของตัวเองได้ทันทีที่หน้าหลัก

### For Admin (ระบบแอดมิน)
- **Centralized Dashboard:** สรุปตัวเลขผู้เล่น, คะแนนรวม และสถานะระบบ
- **Player Control:** รีเซ็ตคะแนน หรือ ลบผู้เล่นที่ทำผิดกฎ
- **Deep Audit:** ตรวจสอบประวัติการเล่นของผู้เล่นทุกคนเพื่อความโปร่งใส
- **Security Persistence:** ระบบล็อกอินแอดมินใช้ Session-based เพื่อความปลอดภัย

---

##  INSTALLATION & SETUP

### 1. Environment Config (`.env`)
ตั้งค่าไฟล์ `.env` เพื่อเชื่อมต่อระบบ:
```env
# Database
DATABASE_URL="YOUR_SQL_SERVER_CONNECTION_STRING"

# Admin Access
ADMINID="YOUR_ADMIN_ID"
ADMINPW="YOUR_ADMIN_PASSWORD"

# NextAuth
NEXTAUTH_SECRET="RANDOM_STRING"
NEXTAUTH_URL="http://localhost:3000"


# หากต้องการเชื่อมด้วย Social Login จะต้องกำหนด ID และ Secret ของแต่ละ Social Login
GITHUB_ID=
GITHUB_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

LINE_CLIENT_ID=
LINE_CLIENT_SECRET=
```

### 2. Quick Run
```bash
# Install Dependencies
npm install

# Database Synchronization
npx prisma db push
npx prisma generate

# Final Launch
npm run dev
```

---

##  คู่มือการปรับแต่ง (Customization Guide)

หากคุณต้องการปรับแต่งระบบต่างๆ ของเกม สามารถทำได้ตามตำแหน่งไฟล์ดังนี้:

### การปรับระดับความฉลาดของ AI
- **ไฟล์:** `ox-game-3d/lib/ai.ts`
- **คำแนะนำ:** แก้ไขอัลกอริทึม **Minimax** ในไฟล์นี้เพื่อปรับความลึก (Depth) หรือตรรกะการวิเคราะห์หมาก

### การปรับคะแนนและกฎเกณฑ์ (Scoring Rules)
- **ไฟล์:** `ox-game-3d/app/api/score/route.ts`
- **คำแนะนำ:** สามารถปรับแต้มที่ได้รับเมื่อ ชนะ (+1), แพ้ (-1) หรือเพิ่มโบนัสพิเศษให้กับ **Win Streak** ได้ที่นี่

### การปรับแต่งดีไซน์ (Design & Theme)
- **สไตล์หลัก:** `ox-game-3d/app/globals.css`
- **คำแนะนำ:** ปรับแก้ค่าสี Neon, แสง Glow และ Grid Background เพื่อเปลี่ยนสีของเกม หรือ บรรยากาศของเกม ได้

### การจัดการโครงสร้างข้อมูล (Database)
- **ไฟล์:** `ox-game-3d/prisma/schema.prisma`
- **คำแนะนำ:** หากต้องการเพิ่มฟิลด์เก็บข้อมูลใหม่ๆ (เช่น สถิติเกมเพิ่ม) ให้แก้ไข Schema ที่นี่แล้วรัน `npx prisma db push` อีกครั้ง

### หน้าจัดการแอดมิน (Admin UI)
- **ไฟล์:** `ox-game-3d/app/admin/page.tsx`
- **คำแนะนำ:** ปรับแต่งหน้า Dashboard และส่วนการจัดการข้อมูลผู้เล่นตามความต้องการ

---
*คู่มือนี้จัดทำขึ้นเพื่อช่วยให้เข้าใจโครงสร้างโปรเจกต์ได้รวดเร็วขึ้น*

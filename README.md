Here is the **full `README.md`** file you can copy and paste directly into your project:

---

```markdown
# 🎥 Video Interview Booking Platform

A full-stack web application built with **Next.js 14 (App Router + TypeScript)** that allows students to book video interviews with employees from top tech companies (e.g., FAANG). Employees can set availability and manage interview sessions, while students can browse, book, and join live interview calls.

---

## ✨ Features

### 👤 Employee (Interviewer) Portal
- Secure registration & login
- Profile setup: company name, job title, bio
- Set and manage availability calendar
- Dashboard to view upcoming bookings
- Join interviews via video call link

### 🎓 Candidate (Student) Portal
- Secure registration & login
- Browse or search for companies
- View available interviewers per company
- Book interview time slots
- Receive email confirmation + calendar invite

### 🔄 Shared Features
- Real-time video interviews using **Jitsi Meet** (or **Zoom**)
- Email notifications via **SendGrid** / **Resend**
- Calendar booking UI with **React Big Calendar**
- Secure authentication using **NextAuth.js**
- Optional payment integration with **Stripe**
- Admin dashboard for monitoring and control

---

## 🛠 Tech Stack

| Layer        | Tech                          |
|--------------|-------------------------------|
| Frontend     | Next.js 14 (App Router, TS)   |
| Backend      | Next.js API Routes (Edge/SSR) |
| Styling      | Tailwind CSS                  |
| Database     | PostgreSQL + Prisma ORM       |
| Auth         | NextAuth.js / Clerk           |
| Calendar     | React Big Calendar            |
| Video        | Jitsi Meet SDK / Zoom API     |
| Email        | Resend / SendGrid / Nodemailer|
| Payment      | Stripe (optional)             |
| Hosting      | Vercel + Railway / Supabase   |

---

## 📁 Folder Structure

```

/app
/auth          → login, register, session
/dashboard     → interviewer & candidate views
/booking       → booking calendar, confirmation
/api           → API endpoints (REST)
/admin         → admin dashboard

/components      → Reusable UI components
/lib             → DB, email, auth, utility services
/prisma          → Prisma schema and migrations
/styles          → Tailwind and global CSS
.env.local       → Environment variables

````

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-org/video-interview-app.git
cd video-interview-app
````

### 2. Install dependencies

```bash
npm install
# or
yarn install
```


### 4. Set up the database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

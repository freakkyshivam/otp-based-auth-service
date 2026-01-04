# OTP-Based Authentication Service

A production-style authentication system built with security-first design.
Implements OTP-based login, session management, refresh token rotation, and device-aware session control.

> This is not a toy project. The focus is on **real-world auth problems** like OTP abuse, session hijacking, and multi-device control.

---

## 🚀 Live Demo
- **Frontend (Vercel):** <https://otpbasedauth.vercel.app/>
- **Backend API (Render):** <https://otp-based-auth-system.onrender.com>

---

## 🔐 Core Features

- OTP-based authentication with expiry & attempt limits
- Redis-backed OTP storage (no DB misuse)
- JWT access & refresh token flow
- Refresh token **rotation** (prevents token replay)
- Session management with device & IP tracking
- Terminate individual sessions or all other sessions
- Secure cookies (httpOnly, sameSite, production-safe)
- Rate limiting for OTP abuse prevention
- Email delivery via queue-based system
- Clean backend–frontend separation (monorepo)
- Two step verification via OTP or backupcodes

---

## 🧠 Authentication Flow (High Level)

1. User requests OTP
2. OTP generated & stored in Redis with TTL
3. OTP sent via email (queued)
4. User verifies OTP
5. Access token + refresh token issued
6. Session created with device metadata
7. Refresh token rotation on renewal
8. Old refresh tokens invalidated automatically

---

## 🛡️ Security Decisions (WHY, not WHAT)

- **Redis for OTPs:**  
  OTPs are temporary secrets — storing them in DB is slow and unnecessary.

- **Refresh Token Rotation:**  
  Prevents replay attacks if a refresh token leaks.

- **Session Table with Device Info:**  
  Enables session visibility, selective logout, and anomaly detection.

- **httpOnly Cookies:**  
  Protects tokens from XSS attacks.

- **Rate Limiting:**  
  Stops OTP brute-force and email abuse.

---

## 🧱 Tech Stack

### Backend
- Node.js + TypeScript
- Express
- Redis
- JWT
- Drizzle ORM
- PostgreSQL
- Nodemailer
- Docker (local setup)

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Axios

### Deployment
- Backend: **Render**
- Frontend: **Vercel**

---

## ℹ️ This project was migrated from an earlier repository. Commit history prior to migration is not available here.

 


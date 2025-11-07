# 🕊️ Wisper Backend

Wisper is a **professional networking platform** that connects job seekers, recruiters, freelancers, consultants, and industry experts.
This backend powers all core features — from authentication and job management to messaging and file uploads — built for **scalability, security, and performance**.

---

## 🚀 Tech Stack

| Category      | Technology               |
| ------------- | ------------------------ |
| Language      | **TypeScript**           |
| Framework     | **Node.js + Express.js** |
| Database      | **PostgreSQL**           |
| ORM           | **Prisma**               |
| File Storage  | **AWS S3**               |
| Validation    | **Zod**                  |
| File Upload   | **Multer**               |
| Email Service | **Nodemailer**           |

---

## 🗂️ Project Structure

```
📦 wisper-backend
├── .vscode/                 # VSCode workspace config
├── dist/                    # Compiled JS files (after build)
├── node_modules/            # Dependencies
├── prisma/                  # Prisma schema and migrations
├── src/
│   ├── app/                 # Core application setup
│   ├── config/              # Configuration files (DB, AWS, etc.)
│   ├── emailTemplates/      # Nodemailer email templates
│   ├── interface/           # TypeScript interfaces
│   ├── middlewares/         # Express middlewares (auth, error handling)
│   ├── modules/             # Main modules grouped by domain
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── business/
│   │   ├── comment/
│   │   ├── favorite/
│   │   ├── job/
│   │   ├── otp/
│   │   ├── person/
│   │   ├── post/
│   │   ├── reaction/
│   │   ├── resume/
│   │   └── uploadFile/
│   ├── routes/              # Express route definitions
│   ├── utils/               # Helper functions
│   ├── validation/          # Zod validation schemas
│   ├── app.ts               # Express app initialization
│   ├── createModule.js      # Module generation script
│   ├── seedAdmin.ts         # Admin seeder
│   └── server.ts            # Server bootstrap
├── .env.example             # Example environment configuration
├── tsconfig.json            # TypeScript config
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

---

## 🧩 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/junayednoman/wisper-server
cd wisper-server
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

```bash
cp .env.example .env
```

Fill out the values as needed.

### 4️⃣ Run Prisma migrations

```bash
npx prisma migrate dev
```

### 5️⃣ Seed the initial admin

```bash
npm run seed:admin
```

### 6️⃣ Start the development server

```bash
npm run dev
```

### 7️⃣ Build for production

```bash
npm run build
npm start
```

## 📧 Email & Notification

- Uses **Nodemailer** for sending verification, job alerts, and notification emails.
- Templates are stored in `src/emailTemplates/`.

---

## 🪣 File Uploads (AWS S3)

- Multer handles incoming files.
- Uploaded files are stored securely in AWS S3.
- File URLs are automatically saved in the database through Prisma.

---

## 🧾 Validation (Zod)

All incoming requests are validated with **Zod** to ensure data accuracy and prevent malformed input.

---

## 🧰 Scripts

| Command              | Description                   |
| -------------------- | ----------------------------- |
| `npm run dev`        | Start dev server with nodemon |
| `npm run build`      | Compile TypeScript            |
| `npm start`          | Start production build        |
| `npm run lint`       | Run ESLint                    |
| `npm run seed:admin` | Create default admin user     |

---

**Made with ❤️ by Junayed Noman**

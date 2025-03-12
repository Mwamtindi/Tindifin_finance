<div align="center">
  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=FD306E" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Appwrite-black?style=for-the-badge&logoColor=white&logo=appwrite&color=FD366E" alt="appwrite" />
  </div>

  <h3 align="center">Finance SaaS Platform</h3>

</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)

## <a name="introduction">🤖 Introduction</a>

A Finance SaaS Platform designed to centralize financial management for businesses and individuals. The platform provides tools for tracking income, expenses, and managing financial operations through real-time insights. Built with security, scalability, and user-friendliness in mind, it supports financial decision-making and growth.


## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js
- Appwrite
- Typescript
- TailwindCSS
- ShadCN
- PostgreSql

## <a name="features">🔋 Features</a>

👉 **Centralized Financial Management**: Consolidates financial data into a single platform.

👉 **Real-Time Reporting**: Interactive dashboards provide up-to-date financial insights.

👉 **Secure Authentication**: User authentication and management via Clerk.

👉 **Data Encryption**: Sensitive information is secured through encryption.

👉 **Customizable Reports**: Export and generate financial reports tailored to user needs.

👉 **Scalability**: The architecture supports business growth and evolving needs.

👉 **User Roles and Permissions**: Role-based access control for administrators and end-users.

👉 **Error Monitoring with Sentry**: Tracks application performance and issues.

👉 **Responsive Design**: Works seamlessly on various devices.

and many more, including code architecture and reusability

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/Mwamtindi/Tindifin_finance.git
cd  Tindifin_finance
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
# Clerk Configuration  
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=

# Database Configuration  
DATABASE_URL=

# App URL  
NEXT_PUBLIC_APP_URL=http://localhost:3000  
```

Replace any placeholders with your actual credentials where necessary.

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

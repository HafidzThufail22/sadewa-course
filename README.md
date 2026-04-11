# sadewa-course 

A dynamic landing page and custom Content Management System (Mini-CMS) designed for a driving school. This project effectively separates the public-facing promotional site from a secure admin dashboard within a single, efficient architecture.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)

## ✨ Key Features

### 🌐 Public Facing (User App)
- **Single Page Application (SPA):** Seamless navigation with smooth scrolling sections.
- **Dynamic Course Packages:** Real-time fetching of driving course packages directly from the database.
- **Responsive Design:** Fully optimized UI/UX for both mobile and desktop devices.
- **Integrated Contact Form:** Inquiries are securely sent and stored in the admin system.

### 🔒 Admin Dashboard (Mini-CMS)
- **Secure Authentication:** Protected routes powered by Supabase Auth.
- **Package Management (CRUD):** Easily add, edit, or remove driving course packages, including details like duration, vehicle type, and "popular" status.
- **Dynamic Content Control:** Update hero text, about section content, and promotional images without touching the codebase.
- **Inbox Management:** View and manage incoming messages from prospective students.

## 📂 Modular Architecture

This project utilizes a modular design pattern with Next.js Route Groups to maintain a clean and scalable codebase:
- `src/app/(public)/` - Contains the main SPA Landing Page.
- `src/app/admin/` - Contains the secure Admin Dashboard and management routes.
- `src/components/ui/` - Reusable "dumb" UI components (Buttons, Tables, Inputs).
- `src/components/sections/` - Smart components for page layout construction.

## 🚀 Getting Started

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HafidzThufail/sadewa-course.git
   cd sadewa-course
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or encounter any issues, please feel free to open an issue or submit a pull request.

## 📄 License

Internal use only for Sadewa Driving School.
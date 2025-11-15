# Supabase Authentication Setup

This project uses Supabase for authentication with email/password and Google OAuth.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be fully initialized

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 3. Configure Environment Variables

Create a `.env.local` file in the `frontend` directory with the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with the values from step 2.

### 4. Enable Google OAuth (Optional)

1. In your Supabase project dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list and click on it
3. Enable the Google provider
4. You'll need to:
   - Create a Google OAuth application in the [Google Cloud Console](https://console.cloud.google.com/)
   - Get your **Client ID** and **Client Secret**
   - Add your redirect URL: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Enter the Client ID and Client Secret in Supabase
5. Save the changes

### 5. Configure Redirect URLs

1. In your Supabase project dashboard, go to **Authentication** → **URL Configuration**
2. Add your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)

### 6. Run the Application

```bash
cd frontend
pnpm install
pnpm dev
```

## Features

- ✅ Email/Password authentication
- ✅ Google OAuth authentication
- ✅ Protected routes (middleware)
- ✅ User session management
- ✅ Automatic redirects for authenticated/unauthenticated users

## Routes

- `/login` - Login page
- `/signup` - Sign up page
- `/auth/callback` - OAuth callback handler
- `/auth/logout` - Logout handler

## Usage

### Login
Users can log in using:
- Email and password
- Google OAuth

### Sign Up
Users can create an account using:
- Email and password (requires email verification)
- Google OAuth

### Protected Routes
All routes except `/`, `/about`, `/login`, `/signup`, and `/auth/*` require authentication. Unauthenticated users will be redirected to `/login`.


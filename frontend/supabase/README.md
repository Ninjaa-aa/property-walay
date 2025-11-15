# Supabase Database Migrations

This directory contains SQL migration files for setting up the database schema.

## Running Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: [https://app.supabase.com](https://app.supabase.com)
2. Navigate to **SQL Editor**
3. Copy the contents of `001_create_profiles_table.sql`
4. Paste and run the SQL in the SQL Editor
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Initialize Supabase (if not already done)
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Migration Files

### 001_create_profiles_table.sql

Creates the `profiles` table with the following structure:
- `id` (UUID) - References `auth.users(id)`
- `first_name` (TEXT) - User's first name
- `last_name` (TEXT) - User's last name
- `email` (TEXT) - User's email address
- `created_at` (TIMESTAMP) - Account creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Features:**
- Row Level Security (RLS) enabled
- Policies for users to read/update their own profiles
- Automatic profile creation trigger on user signup
- Automatic `updated_at` timestamp trigger

## Important Notes

1. **Password Storage**: Passwords are NOT stored in the profiles table. Supabase handles password hashing in the `auth.users` table automatically.

2. **Automatic Profile Creation**: The database trigger `handle_new_user()` automatically creates a profile entry when a new user signs up. The trigger reads `first_name` and `last_name` from the user's metadata.

3. **Google OAuth**: For Google OAuth users, the profile is created in the callback route handler if it doesn't exist.

4. **Security**: Row Level Security (RLS) ensures users can only access their own profile data.


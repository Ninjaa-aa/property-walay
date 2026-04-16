import type { User as SupabaseUser } from "@supabase/supabase-js";

export type UserType = "seeker" | "agent";

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  avatar?: string;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  avatar: string | null;
  phone: string | null;
  calendly_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserDisplayInfo {
  firstName: string;
  lastName: string;
  userInitials: string;
  userName: string;
  userRole: string;
}

export type { SupabaseUser };

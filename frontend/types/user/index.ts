export type UserType = "seeker" | "agent";

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  avatar?: string;
}

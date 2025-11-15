import type { Activity } from "@/types/dashboard";
import type { SupabaseUser, UserProfile, UserDisplayInfo } from "@/types/user";

export function getUserDisplayInfo(
  user: SupabaseUser | null,
  profile: UserProfile | null
): UserDisplayInfo {
  const firstName =
    profile?.first_name || user?.user_metadata?.first_name || "";
  const lastName = profile?.last_name || user?.user_metadata?.last_name || "";
  const userInitials =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`.toUpperCase()
      : user?.email?.split("@")[0].substring(0, 2).toUpperCase() || "U";
  const userName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const userRole = profile?.role || "Property Seeker";

  return {
    firstName,
    lastName,
    userInitials,
    userName,
    userRole,
  };
}

export function formatPrice(price: number, currency: "PKR" | "USD"): string {
  if (currency === "PKR") {
    if (price >= 10000000) {
      return `PKR ${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `PKR ${(price / 100000).toFixed(0)} Lac`;
    }
    return `PKR ${price.toLocaleString()}`;
  }
  return `$${price.toLocaleString()}`;
}

export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return "Just now";
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export function getActivityColor(type: Activity["type"]): string {
  switch (type) {
    case "save":
      return "bg-blue-500";
    case "price_change":
      return "bg-green-500";
    case "new_matches":
      return "bg-amber-500";
    case "meeting":
      return "bg-purple-500";
    case "view":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
}

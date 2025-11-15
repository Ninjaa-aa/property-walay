"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

type PasswordStrength = "weak" | "medium" | "strong";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo((): PasswordStrength => {
    if (!password) return "weak";

    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1; // lowercase
    if (/[A-Z]/.test(password)) score += 1; // uppercase
    if (/[0-9]/.test(password)) score += 1; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score += 1; // special chars

    if (score <= 2) return "weak";
    if (score <= 4) return "medium";
    return "strong";
  }, [password]);

  const strengthConfig = {
    weak: {
      label: "Weak",
      color: "bg-red-500",
      textColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      width: "w-1/3",
    },
    medium: {
      label: "Medium",
      color: "bg-yellow-500",
      textColor: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      width: "w-2/3",
    },
    strong: {
      label: "Strong",
      color: "bg-green-500",
      textColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      width: "w-full",
    },
  };

  const config = strengthConfig[strength];

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Password strength</span>
        <span className={cn("font-medium", config.textColor)}>
          {config.label}
        </span>
      </div>
      <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full transition-all duration-300",
            config.color,
            config.width
          )}
        />
      </div>
      <div className={cn("rounded-md p-2 text-xs", config.bgColor)}>
        <p className={cn("font-medium", config.textColor)}>
          {strength === "weak" &&
            "Use at least 8 characters with a mix of letters, numbers, and symbols."}
          {strength === "medium" &&
            "Good! Consider adding more characters or special symbols for better security."}
          {strength === "strong" &&
            "Excellent! Your password is strong and secure."}
        </p>
      </div>
    </div>
  );
}

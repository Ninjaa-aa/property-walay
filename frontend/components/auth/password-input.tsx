"use client";

import { forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { PasswordStrength } from "./password-strength";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.ComponentProps<typeof Input> {
  showStrength?: boolean;
  passwordValue?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      showStrength = false,
      passwordValue,
      className,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    // Ensure value is always defined to prevent controlled/uncontrolled warning
    const inputValue = value ?? defaultValue ?? "";

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={cn("pr-10", className)}
            {...props}
            value={inputValue}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="text-muted-foreground h-4 w-4" />
            ) : (
              <Eye className="text-muted-foreground h-4 w-4" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
        {showStrength && passwordValue && (
          <PasswordStrength password={passwordValue} />
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

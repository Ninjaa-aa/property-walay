# Authentication Components

This directory contains standardized, reusable authentication components that can be used across signup, login, reset password, and forgot password flows.

## Standardized Components

### 1. **PasswordInput** (`password-input.tsx`)
A reusable password input component with:
- Show/hide password toggle
- Optional password strength indicator
- Consistent styling across all forms

**Usage:**
```tsx
<PasswordInput
  placeholder="••••••••"
  showStrength={true}  // Optional: show strength indicator
  passwordValue={passwordValue}  // Required if showStrength is true
  {...field}
/>
```

### 2. **PasswordStrength** (`password-strength.tsx`)
Visual password strength indicator showing:
- Weak (red)
- Medium (yellow)
- Strong (green)
- Real-time feedback and tips

### 3. **Validation Schemas** (`lib/validations/auth.ts`)
Centralized validation schemas:
- `passwordSchema` - Password validation rules
- `emailSchema` - Email validation
- `nameSchema` - Name validation
- `signupSchema` - Complete signup form validation
- `loginSchema` - Login form validation
- `resetPasswordSchema` - Reset password validation
- `forgotPasswordSchema` - Forgot password validation
- `changePasswordSchema` - Change password validation

## Form Components

### SignupForm
- Uses `signupSchema` for validation
- Includes first name, last name, email, password, and confirm password
- Shows password strength indicator
- Creates user profile automatically

### LoginForm
- Uses `loginSchema` for validation
- Email and password fields
- Uses `PasswordInput` component

### ResetPasswordForm
- Uses `resetPasswordSchema` for validation
- New password and confirm password fields
- Shows password strength indicator
- Handles password reset via email code

### ForgotPasswordForm
- Uses `forgotPasswordSchema` for validation
- Email field only
- Sends password reset email

## Benefits of Standardization

1. **Consistency**: All forms use the same validation rules and UI components
2. **Reusability**: Components can be easily reused across different forms
3. **Maintainability**: Update validation rules in one place
4. **User Experience**: Consistent password strength feedback and show/hide functionality
5. **Type Safety**: Shared TypeScript types for all form values

## Adding New Auth Forms

To create a new authentication form:

1. **Add validation schema** to `lib/validations/auth.ts`:
```tsx
export const myFormSchema = z.object({
  // your fields
});
```

2. **Create form component** using the standardized components:
```tsx
import { PasswordInput } from "@/components/auth/password-input";
import { myFormSchema, type MyFormValues } from "@/lib/validations/auth";

export function MyForm() {
  const form = useForm<MyFormValues>({
    resolver: zodResolver(myFormSchema),
    // ...
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <PasswordInput
                showStrength={true}
                passwordValue={form.watch("password")}
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
}
```

## Password Requirements

All password fields use the same validation:
- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character

These requirements are enforced in `passwordSchema` and can be updated in one place.


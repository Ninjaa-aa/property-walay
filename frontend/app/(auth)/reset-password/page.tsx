import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function ResetPasswordFormFallback() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="container flex min-h-[calc(100vh-80px)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ResetPasswordFormFallback />}>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

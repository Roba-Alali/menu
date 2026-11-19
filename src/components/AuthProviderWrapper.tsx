"use client";

import FirebaseErrorBoundary from "@/components/FirebaseErrorBoundary";
import { AuthProvider } from "@/components/AuthProvider";

export default function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseErrorBoundary>
      <AuthProvider>{children}</AuthProvider>
    </FirebaseErrorBoundary>
  );
}

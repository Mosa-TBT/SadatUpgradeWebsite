"use client";

import ResetPasswordInner from "@/components/reset-password-inner";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ChevronLeft, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordClient() {
  const [submitting, setSubmitting] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = handleSubmit(async (input) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Something went wrong.");
        setSubmitting(false);
        return;
      }
      setSent(true);
    } catch {
      toast.error("Network error — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-gray-200 bg-canvas p-6 shadow-sm sm:p-8">
        <Link
          href="/login"
          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-marigold-deep"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Back to log in
        </Link>

        {sent ? (
          <div className="mt-6 text-center">
            <CheckCircle2 className="mx-auto size-10 text-mehendi" aria-hidden />
            <h1 className="mt-3 font-display text-xl font-bold text-ink">
              Check your email
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              If an account exists for that email, we've sent a link to reset
              your password. It expires in 30 minutes.
            </p>
          </div>
        ) : (
          <>
            <h1 className="mt-3 font-display text-2xl font-bold text-ink">
              Forgot password
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
                {errors.email ? (
                  <p role="alert" className="text-xs font-medium text-sindoor">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Mail />
                    Send reset link
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

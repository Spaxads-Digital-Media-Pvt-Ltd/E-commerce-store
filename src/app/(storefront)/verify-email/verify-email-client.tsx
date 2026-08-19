"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { verifyOtpSchema, type VerifyOtpInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RESEND_COOLDOWN_SECONDS = 30;

export function VerifyEmailClient({
  email,
  next,
}: {
  email: string;
  next: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email },
  });

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const onSubmit = handleSubmit(async (input) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't verify that code.");
        setSubmitting(false);
        return;
      }
      router.push(next);
      router.refresh();
      setSubmitting(false);
    } catch {
      toast.error("Network error — check your connection and try again.");
      setSubmitting(false);
    }
  });

  async function resend() {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("A new code is on its way.");
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Couldn't resend the code.");
      }
    } catch {
      toast.error("Network error — check your connection and try again.");
    }
  }

  if (!email) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4 py-12">
        <div className="w-full rounded-2xl border border-gray-200 bg-canvas p-6 text-center shadow-sm sm:p-8">
          <h1 className="font-display text-xl font-bold text-ink">
            Missing email
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Start from registration or login to verify an account.
          </p>
          <Link
            href="/register"
            className="mt-4 inline-block font-semibold text-marigold-deep hover:underline"
          >
            Go to registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-gray-200 bg-canvas p-6 shadow-sm sm:p-8">
        <MailCheck className="mx-auto size-10 text-marigold-deep" aria-hidden />
        <h1 className="mt-3 text-center font-display text-2xl font-bold text-ink">
          Verify your email
        </h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          We sent a 6-digit code to <span className="font-medium text-ink">{email}</span>.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
          <input type="hidden" {...register("email")} />
          <div className="space-y-1.5">
            <Label htmlFor="otp-code">Verification code</Label>
            <Input
              id="otp-code"
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              placeholder="123456"
              className="text-center font-mono text-lg tracking-[0.5em]"
              {...register("code")}
              aria-invalid={!!errors.code}
            />
            {errors.code ? (
              <p role="alert" className="text-xs font-medium text-sindoor">
                {errors.code.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="animate-spin" />
                Verifying…
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Didn't get it?{" "}
          <button
            type="button"
            onClick={resend}
            disabled={cooldown > 0}
            className="font-semibold text-marigold-deep hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
        </p>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters").max(200),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });
type FormInput = z.infer<typeof formSchema>;

export function ResetPasswordClient({ token }: { token: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: zodResolver(formSchema) });

  const onSubmit = handleSubmit(async (input) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: input.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't reset your password.");
        setSubmitting(false);
        return;
      }
      toast.success("Password updated — you're logged in.");
      router.push("/account");
      router.refresh();
      setSubmitting(false);
    } catch {
      toast.error("Network error — check your connection and try again.");
      setSubmitting(false);
    }
  });

  if (!token) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4 py-12">
        <div className="w-full rounded-2xl border border-gray-200 bg-canvas p-6 text-center shadow-sm sm:p-8">
          <h1 className="font-display text-xl font-bold text-ink">
            Invalid reset link
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            This link is missing its token. Request a new one below.
          </p>
          <Link
            href="/forgot-password"
            className="mt-4 inline-block font-semibold text-marigold-deep hover:underline"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-gray-200 bg-canvas p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-2xl font-bold text-ink">
          Set a new password
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Choose a new password for your account.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="reset-password">New password</Label>
            <Input
              id="reset-password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            {errors.password ? (
              <p role="alert" className="text-xs font-medium text-sindoor">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reset-confirm">Confirm password</Label>
            <Input
              id="reset-confirm"
              type="password"
              autoComplete="new-password"
              {...register("confirm")}
              aria-invalid={!!errors.confirm}
            />
            {errors.confirm ? (
              <p role="alert" className="text-xs font-medium text-sindoor">
                {errors.confirm.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <KeyRound />
                Set new password
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

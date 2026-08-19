import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Client-facing errors stay generic; details are logged server-side only
// (blueprint §13 — data exposure).

export function apiError(message: string, status: number, extra?: object) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export function zodErrorResponse(err: ZodError) {
  // Field-level messages are safe to return — they describe the caller's own
  // input, never internals.
  const { fieldErrors, formErrors } = err.flatten();
  return NextResponse.json(
    { error: "Invalid request.", fieldErrors, formErrors },
    { status: 400 }
  );
}

export function serverErrorResponse(err: unknown, context: string) {
  console.error(`[${context}]`, err);
  return apiError("Something went wrong.", 500);
}

import type { Metadata } from "next";
import { RegisterClient } from "./register-client";

export const metadata: Metadata = { title: "Create account" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <RegisterClient next={next && next.startsWith("/") ? next : "/account"} />
  );
}

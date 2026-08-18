import type { Metadata } from "next";
import { LoginClient } from "./login-client";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <LoginClient next={next && next.startsWith("/") ? next : "/account"} />;
}

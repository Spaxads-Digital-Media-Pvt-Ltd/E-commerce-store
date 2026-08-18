"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="bottom-center"
      mobileOffset={{ bottom: 88 }} // clear the mobile bottom nav + cart bar
      toastOptions={{
        style: {
          background: "#0E2A28",
          color: "#FBF8F2",
          border: "none",
        },
      }}
    />
  );
}

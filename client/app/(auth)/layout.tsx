import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - GoNXT CoolerTracker",
  description: "Sign in to your GoNXT CoolerTracker account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}

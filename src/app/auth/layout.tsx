import { Suspense } from "react";
import Header from "@/components/shared/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Suspense>{children}</Suspense>
    </>
  );
}
import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Creda Chain | Secure Blockchain Payments",
  description:
    "Experience the future of payments with Creda Chain. Secure, fast, and verifiable blockchain-based transactions for everyday needs.",
  icons: {
    icon: "/logo.png",
  },
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">{children}</main>
    </>
  );
}

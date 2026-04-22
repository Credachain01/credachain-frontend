import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import SolanaWalletProvider from "@/components/providers/SolanaWalletProvider";

export const metadata: Metadata = {
  title: "Creda Chain | Secure Blockchain Payments",
  description:
    "Experience the future of payments with Creda Chain. Secure, fast, and verifiable blockchain-based transactions for everyday needs.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SolanaWalletProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SolanaWalletProvider>
      </body>
    </html>
  );
}

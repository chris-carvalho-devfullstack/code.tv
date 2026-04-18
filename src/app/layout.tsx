import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Code TV - Chaves UniTV",
  description: "Venda de chaves de ativação UniTV com entrega imediata.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br">
      <body className={geist.className}>
        <Navbar />
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppHeader from "./site-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MedPort - Healthcare Communication Platform",
  description:
    "A revolutionary healthcare communication platform bridging critical gaps in patient care and medical information management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}

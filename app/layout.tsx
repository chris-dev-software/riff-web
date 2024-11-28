import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui";

export const metadata: Metadata = {
  title: "RIFF",
  description: "RIFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <div className="h-screen grid bg-background overflow-hidden">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Water Cooler — Build Deeper Connections",
  description: "AI-powered conversation starters that help you build deeper relationships with colleagues.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

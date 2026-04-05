import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Voice Agency – Prompt Discovery & Deployment",
  description: "Generate and deploy AI voice agents for your business in seconds. Powered by DeepSeek & Vapi.",
};

export const viewport: Viewport = {
  themeColor: "#040a18",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#040a18]">{children}</body>
    </html>
  );
}

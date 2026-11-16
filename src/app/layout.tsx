import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NABOULSI — A Taste Worth Remembering",
  description: "Discover the menu of NABOULSI Resto Cafe.",
  applicationName: "NABOULSI Digital Menu",
  openGraph: {
    title: "NABOULSI — A Taste Worth Remembering",
    description: "A taste worth remembering.",
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

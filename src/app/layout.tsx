import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orangi School | School management",
  description: "Orangi School management and finance portal.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

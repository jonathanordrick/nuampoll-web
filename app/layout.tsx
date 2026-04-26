import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sambal Nuampoll - Nampol Pedasnya!",
  description: "Katalog sambal terbaik untuk selera nusantara",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        {/* Load Feather Icons dari CDN agar icon lama kamu tetap jalan */}
        <script src="https://unpkg.com/feather-icons"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}

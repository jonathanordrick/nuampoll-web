import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Nuampoll | Sekali Nyoba, Langsung Nuampoll!",
  description: "Produk sambal dan makanan pedas terbaik untuk selera nusantara",
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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

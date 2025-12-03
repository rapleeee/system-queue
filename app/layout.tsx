import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistem Antrian Presentasi Kelas",
  description:
    "Aplikasi antrian presentasi berbasis web untuk beberapa kelas (RPL, TKJ, DKV) dengan admin panel, tampilan display untuk siswa, dan sinkronisasi realtime menggunakan Firebase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Vefrit",
  description: "Framendi tengdur við CMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="is">
      <body className="app-shell">
        <header className="site-header">
          <Link href="/" className="brand">
            Vefrit
          </Link>
          <nav className="site-nav">
            <Link href="/">Heim</Link>
            <Link href="/posts">Færslur</Link>
          </nav>
        </header>
        <main className="site-main">{children}</main>
      </body>
    </html>
  );
}

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./index.scss";
import "./theme.scss";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomProvider from "./CustomProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TotalApp",
  description:
    "Realiza tus pagos de impuestos departamentales y municipales facil y rapido",
  other: {
    google: "notranslate",
    "http-equiv-content-language": "en",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no">
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="/imgs/iconografia-total.svg"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} notranslate`}
      >
        <CustomProvider>
          <main>{children}</main>
        </CustomProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Space_Grotesk, Archivo_Black } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/userContext";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});
const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Buzzflix",
  description: "Buzzflix is a streaming service that offers a wide variety of movie trailers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/buzz.png" type="image/png" />
        <script 
          type="module"
          src="https://cdn.jsdelivr.net/npm/@justinribeiro/lite-youtube@1.5.0/lite-youtube.js"
        />
      </head>
      <body className={`${grotesk.variable} ${display.variable} font-sans`}>
        <UserProvider>
          <main className="flex-grow">{children}</main>
        </UserProvider>
        </body>
    </html>
  );
}


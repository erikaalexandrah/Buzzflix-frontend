import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/userContext";
const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <UserProvider>
          <main className="flex-grow">{children}</main>
        </UserProvider>
        </body>
    </html>
  );
}


import "./globals.css";
import { Inter } from "next/font/google";
import NextAuthSessionProvider from "./providers";
import NavComponent from "./components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Система управления Единой Картой Жителя",
  description: "-",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <link rel="icon" href="/favicon.ico" />
      <body>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  );
}

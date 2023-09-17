import "./globals.css"
import {Providers} from "./providers";

export const metadata = {
  title: "Система управления Единой Картой Жителя",
  description: "-",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <link rel="icon" href="/favicon.ico" />
      <body>
        <main className="light text-foreground bg-background">
        <Providers>
          {children}
        </Providers>
        </main>
      </body>
    </html>
  );
}
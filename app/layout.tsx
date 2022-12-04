import { Work_Sans } from "@next/font/google";
import { twMerge } from "tailwind-merge";

import "../styles/globals.css";

type Props = {
  children: React.ReactNode;
};

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="en"
      className={twMerge("h-full antialiased", workSans.variable)}
    >
      <head />
      <body className="h-full bg-slate-1 text-slate-12 dark:bg-slate-dark-1 dark:text-slate-dark-12">
        <main className="isolate h-screen">{children}</main>
      </body>
    </html>
  );
}

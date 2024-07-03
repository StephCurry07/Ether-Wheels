import { Inter } from "next/font/google";
import "./global.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ether-Wheels",
  description: "Carpooling payments made easy by integrating with blockchain",
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/images/ewLogo.ico',
        href: '/images/ewLogo.ico',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/images/ewLogo.ico',
        href: '/images/ewLogo.ico',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

import { Inter } from "next/font/google";
import { CopilotChat } from './../components/CopilotChat';
import "./global.css";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

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

    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CopilotKit runtimeUrl="/api/copilotkit">
          {children}
          <CopilotChat/>
        </CopilotKit>
      </body>
    </html>
  );
}

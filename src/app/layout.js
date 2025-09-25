import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const BricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Unified booking platform",
  description: "Designed & developed by Webrizen",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${BricolageGrotesque.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

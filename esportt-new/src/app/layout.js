import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext"; // Use relative path
import Navbar from "../components/Navbar"; // Use relative path

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata = {
  title: "EsportTT Platform",
  description: "Your next-gen esports tournament platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark"> {/* Use dark mode by default */}
      <body className={`${geistSans.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
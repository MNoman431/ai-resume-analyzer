import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CVInsight.AI - Precision AI Resume Analysis",
  description: "Transform your resume with precision AI analysis and beat the ATS in seconds.",
};

// Layout ko async rakhein taake cookies await ho saken
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  const cookieStore = await cookies();
  
  // Debugging: Terminal mein check karein ke saari cookies kya hain
  const allCookies = cookieStore.getAll();
  console.log("All Cookies in Layout:", allCookies.map(c => c.name));

  const token = cookieStore.get('accessToken')?.value;
  console.log("Token in Layout:", token ? "Found ✅" : "Undefined ❌");

  const isLogedin = !!token;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Yahan attribute="data-theme" wapis kar diya hai */}
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <QueryProvider>
            <Toaster position="top-center" />
            <Navbar isLoggedIn={isLogedin} />
            {children}
            <Footer/>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
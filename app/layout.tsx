import type { Metadata } from "next";
import { Poppins, Open_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider, AuthProvider, GoogleProvider } from "@/components/providers";
import { ToastContainer } from "@/components/ui/toast";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const openSans = Open_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "MarkFlow AI - Smart Markdown Editor",
  description: "AI-powered Markdown editor for developers. Auto-format, preview, and export your documentation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${openSans.variable} ${jetbrainsMono.variable} font-body antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <GoogleProvider>
          <AuthProvider>
            {children}
            <ToastContainer />
          </AuthProvider>
          </GoogleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

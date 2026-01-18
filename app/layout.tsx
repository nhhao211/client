import type { Metadata } from "next";
import { Fredoka, Nunito, JetBrains_Mono } from "next/font/google";
import { ThemeProvider, AuthProvider, GoogleProvider } from "@/components/providers";
import { TetThemeProvider } from "@/components/tet/TetThemeProvider";
import { ToastContainer } from "@/components/ui/toast";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap", // Prevent FOIT - improves LCP
  preload: true,
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Reduced weights to only used ones
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false, // Not critical for initial render
});

export const metadata: Metadata = {
  title: "MemMart - Write Smarter",
  description: "Your cute & intelligent writing companion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fredoka.variable} ${nunito.variable} ${jetbrainsMono.variable} font-body antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TetThemeProvider>
            <GoogleProvider>
            <AuthProvider>
              {children}
              <ToastContainer />
            </AuthProvider>
            </GoogleProvider>
          </TetThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

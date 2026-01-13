"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";
import { ArrowRight, Sparkles, FileText, Zap } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Animated Background */}
      <AnimatedBackground />
      
      <div className="min-h-screen relative overflow-x-hidden">
        {/* Decorative Blobs */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-50 animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] opacity-40 animate-pulse delay-1000" />
          <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] bg-yellow-200/30 rounded-full blur-[80px] opacity-60" />
        </div>

        {/* Floating Navigation - Bubbly Clay Style */}
        <nav className="fixed top-6 left-6 right-6 z-50 max-w-6xl mx-auto">
          <div className="clay-card !bg-white/80 dark:!bg-gray-800/80 backdrop-blur-md px-6 py-4 flex justify-between items-center rounded-full border-2 border-white/50">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-full bg-primary text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-foreground tracking-tight">
                MemMart
              </span>
            </Link>
            <div className="flex gap-4 items-center">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button className="clay-button bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all">
                    Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="hidden sm:block">
                    <Button variant="ghost" className="text-foreground/80 hover:text-primary hover:bg-white/50 text-lg font-bold rounded-full px-6 py-4 h-auto transition-colors">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="clay-button bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section - Playful & Bouncy */}
        <div className="relative pt-44 pb-32">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge - Cute Pill */}
              <div className="inline-flex items-center gap-2 mb-8 px-6 py-2 bg-white dark:bg-card rounded-full shadow-md border-2 border-primary/20 hover:scale-105 transition-transform duration-300 cursor-default">
                <Sparkles className="w-5 h-5 text-accent animate-bounce" />
                <span className="text-base font-bold text-primary">AI-Powered Magic Editor</span>
              </div>

              {/* Title - Big & Round */}
              <h1 className="text-6xl md:text-8xl font-black mb-10 leading-tight tracking-tight text-foreground drop-shadow-sm">
                Write Smarter, <br className="hidden md:block" />
                <span className="relative inline-block text-primary mt-2">
                  Not Harder
                  <svg className="absolute w-[110%] h-6 -bottom-3 -left-[5%] text-accent z-[-1] opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 12 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-muted-foreground mb-14 max-w-2xl mx-auto font-medium leading-relaxed">
                MemMart is your cute & intelligent writing companion. Format, organize, and 
                enhance your content with <span className="text-primary font-bold">AI sparkles</span> in real-time!
              </p>

              {/* CTA Buttons - Big Pills */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24">
                <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                  <Button className="clay-button px-12 py-6 text-xl bg-primary hover:bg-primary/90 text-primary-foreground h-auto rounded-full font-black border-none transform hover:-translate-y-2 transition-all">
                    {isAuthenticated ? "Jump In!" : "Start Writing Now"} <ArrowRight className="ml-3 w-7 h-7" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                  <span className="text-2xl">✨</span> No credit card needed
                </div>
              </div>

              {/* Features Grid - Clay Cards with Icons */}
              <div className="grid md:grid-cols-3 gap-8 mt-10 perspective-1000 items-stretch">
                <div className="clay-card p-10 group relative overflow-hidden !rounded-[2.5rem] hover:scale-105 transition-all duration-300 flex flex-col h-full">
                  <div className="bg-blue-100 dark:bg-blue-900/30 w-24 h-24 rounded-full flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    <FileText className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-4">Smart Format</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed font-medium flex-grow">
                    Auto-magically fixes your Markdown syntax with a single click!
                  </p>
                </div>

                <div className="clay-card p-10 group relative overflow-hidden !rounded-[2.5rem] hover:scale-105 transition-all duration-300 flex flex-col h-full">
                  <div className="bg-pink-100 dark:bg-pink-900/30 w-24 h-24 rounded-full flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    <Zap className="w-12 h-12 text-pink-500" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-4">Live Preview</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed font-medium flex-grow">
                    See your content come to life instantly as you type.
                  </p>
                </div>

                <div className="clay-card p-10 group relative overflow-hidden !rounded-[2.5rem] hover:scale-105 transition-all duration-300 flex flex-col h-full">
                  <div className="bg-purple-100 dark:bg-purple-900/30 w-24 h-24 rounded-full flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    <Sparkles className="w-12 h-12 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-4">AI Buddy</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed font-medium flex-grow">
                    Your personal AI assistant for writing tips and ideas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Minimal */}
        <div className="border-t border-transparent bg-white/30 py-12 mt-10">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-muted-foreground font-bold opacity-70">© 2025 MemMart. Made with 💜 and ☕.</p>
          </div>
        </div>
      </div>
    </>
  );
}

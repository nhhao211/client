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
      
      <div className="min-h-screen relative">
        {/* Floating Navigation - Cursor-inspired minimal */}
        <nav className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto">
          <div className="backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm shadow-black/5 dark:shadow-black/20 px-6 py-3 flex justify-between items-center transition-all duration-150">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-primary text-white shadow-sm">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-lg font-semibold text-foreground">
                MemMart
              </span>
            </Link>
            <div className="flex gap-3">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm transition-all duration-150">
                    Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors duration-150">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm transition-all duration-150">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section - Minimalist */}
        <div className="relative overflow-hidden pt-32 pb-20">
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Badge - Simpler */}
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full shadow-sm hover:shadow-md transition-all duration-150 group">
                <Sparkles className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-foreground">AI-Powered Markdown Editor</span>
              </div>

              {/* Title - Cleaner */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight">
                <span className="text-primary">
                  Write Smarter,
                </span>
                <br />
                <span className="text-foreground">Not Harder</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                MemMart is an intelligent Markdown editor that helps you format, organize, and 
                enhance your content with AI-powered suggestions in real-time.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                  <Button className="px-8 py-6 text-lg bg-primary hover:bg-primary/90 text-white h-auto shadow-lg hover:shadow-xl transition-all duration-150 font-semibold">
                    {isAuthenticated ? "Open Editor" : "Start Writing"} <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg border-gray-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md text-foreground hover:bg-secondary h-auto transition-all duration-150 font-semibold"
                >
                  Learn More
                </Button>
              </div>

              {/* Features Grid - Cleaner cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-20">
                <div className="group p-8 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg transition-all duration-150">
                  <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors duration-150">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Smart Formatting</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Automatic normalization of Markdown syntax with one click
                  </p>
                </div>

                <div className="group p-8 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-accent/50 dark:hover:border-accent/50 hover:shadow-lg transition-all duration-150">
                  <div className="bg-accent/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-accent/20 transition-colors duration-150">
                    <Zap className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Real-time Preview</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    See your formatted content rendered instantly as you type
                  </p>
                </div>

                <div className="group p-8 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg transition-all duration-150">
                  <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors duration-150">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">AI Suggestions</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get AI-powered formatting tips and content improvements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/50 py-12 mt-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-muted-foreground">© 2025 MemMart. Built with Next.js, Express, and AI magic.</p>
          </div>
        </div>
      </div>
    </>
  );
}

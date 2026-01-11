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
        {/* Floating Navigation - Cursor.com style */}
        <nav className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-white/85 dark:bg-slate-950/80 border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 px-6 py-3 flex justify-between items-center transition-all duration-200">
            <Link href="/" className="flex items-center gap-2 cursor-pointer group">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-sm group-hover:shadow-md transition-shadow">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                MemMart
              </span>
            </Link>
            <div className="flex gap-3">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                    Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200 cursor-pointer">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative overflow-hidden pt-32 pb-20">
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
                <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">AI-Powered Markdown Editor</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 dark:from-blue-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  Write Smarter,
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">Not Harder</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                MemMart is an intelligent Markdown editor that helps you format, organize, and 
                enhance your content with AI-powered suggestions in real-time.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                  <Button className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white h-auto shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer font-semibold">
                    {isAuthenticated ? "Open Editor" : "Start Writing"} <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg border-gray-300 dark:border-white/20 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-slate-800 h-auto transition-all duration-200 cursor-pointer font-semibold"
                >
                  Learn More
                </Button>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 mt-20">
                <div className="group p-8 rounded-2xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 hover:border-blue-400/50 dark:hover:border-blue-400/30 hover:shadow-xl transition-all duration-200 cursor-pointer">
                  <div className="bg-blue-500/10 dark:bg-blue-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/30 transition-colors duration-200">
                    <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Smart Formatting</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Automatic normalization of Markdown syntax with one click
                  </p>
                </div>

                <div className="group p-8 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 hover:border-cyan-400/50 dark:hover:border-cyan-400/30 hover:shadow-xl transition-all duration-200 cursor-pointer">
                  <div className="bg-cyan-500/10 dark:bg-cyan-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-cyan-500/20 dark:group-hover:bg-cyan-500/30 transition-colors duration-200">
                    <Zap className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real-time Preview</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    See your formatted content rendered instantly as you type
                  </p>
                </div>

                <div className="group p-8 rounded-2xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 hover:border-blue-400/50 dark:hover:border-blue-400/30 hover:shadow-xl transition-all duration-200 cursor-pointer">
                  <div className="bg-blue-500/10 dark:bg-blue-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/30 transition-colors duration-200">
                    <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">AI Suggestions</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Get AI-powered formatting tips and content improvements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-white/10 backdrop-blur-xl bg-white/60 dark:bg-slate-950/50 py-12 mt-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-700 dark:text-gray-400">© 2025 MemMart. Built with Next.js, Express, and AI magic.</p>
          </div>
        </div>
      </div>
    </>
  );
}

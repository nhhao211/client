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
        {/* Navigation */}
        <nav className="border-b border-white/10 backdrop-blur-xl bg-black/30 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                MemMart
              </span>
            </div>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all">
                    Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-white hover:bg-white/10 backdrop-blur-xl">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-lg hover:bg-white/15 transition-all cursor-pointer">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span className="text-sm text-white font-medium">AI-Powered Markdown Editor</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                  Write Smarter,
                </span>
                <br />
                <span className="text-white">Not Harder</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                MemMart is an intelligent Markdown editor that helps you format, organize, and 
                enhance your content with AI-powered suggestions in real-time.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                  <Button className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-auto shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all hover:scale-105">
                    {isAuthenticated ? "Open Editor" : "Start Writing"} <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg border-white/30 bg-white/5 text-white hover:bg-white/10 backdrop-blur-xl h-auto hover:border-white/50 transition-all"
                >
                  Learn More
                </Button>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 mt-20">
                <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-xl border border-white/10 hover:border-blue-400/50 hover:bg-blue-500/15 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
                  <div className="bg-blue-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Smart Formatting</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Automatic normalization of Markdown syntax with one click
                  </p>
                </div>

                <div className="group p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/15 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20">
                  <div className="bg-cyan-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Real-time Preview</h3>
                  <p className="text-slate-300 leading-relaxed">
                    See your formatted content rendered instantly as you type
                  </p>
                </div>

                <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-xl border border-white/10 hover:border-purple-400/50 hover:bg-purple-500/15 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
                  <div className="bg-purple-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">AI Suggestions</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Get AI-powered formatting tips and content improvements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 backdrop-blur-xl bg-black/30 py-8 mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-slate-400">© 2025 MemMart. Built with Next.js, Express, and AI magic.</p>
          </div>
        </div>
      </div>
    </>
  );
}

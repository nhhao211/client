"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";
import { ArrowRight, Sparkles, FileText, Zap } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              MemMart
            </span>
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
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
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-40 -left-40 animate-pulse" />
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl bottom-40 -right-40 animate-pulse delay-2000" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white">AI-Powered Markdown Editor</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Write Smarter,
              </span>
              <br />
              <span className="text-white">Not Harder</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              MemMart is an intelligent Markdown editor that helps you format, organize, and 
              enhance your content with AI-powered suggestions in real-time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                <Button className="px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-auto">
                  {isAuthenticated ? "Open Editor" : "Start Writing"} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="px-8 py-3 text-lg border-white/20 text-white hover:bg-white/10 h-auto"
              >
                Learn More
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-20">
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-blue-400/50 transition-colors">
                <FileText className="w-8 h-8 text-blue-400 mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-white mb-2">Smart Formatting</h3>
                <p className="text-slate-400">
                  Automatic normalization of Markdown syntax with one click
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 transition-colors">
                <Zap className="w-8 h-8 text-cyan-400 mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-white mb-2">Real-time Preview</h3>
                <p className="text-slate-400">
                  See your formatted content rendered instantly as you type
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-400/50 transition-colors">
                <Sparkles className="w-8 h-8 text-purple-400 mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-white mb-2">AI Suggestions</h3>
                <p className="text-slate-400">
                  Get AI-powered formatting tips and content improvements
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 backdrop-blur-xl bg-black/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>© 2025 MemMart. Built with Next.js, Express, and AI magic.</p>
        </div>
      </div>
    </div>
  );
}

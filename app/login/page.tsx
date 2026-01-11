"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInWithGoogle } from "@/lib/firebase";
import { useAuth } from "@/components/providers/AuthProvider";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { FileText, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Sign in with Google
      const result = await signInWithGoogle();
      
      // Get ID token from Firebase
      const idToken = result.idToken;
      
      // Sync with backend and auth context
      await login(idToken);

      // Redirect to dashboard or intended path
      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/dashboard";
      sessionStorage.removeItem("redirectAfterLogin");
      router.push(redirectPath);
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setError(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen flex items-center justify-center px-4 relative">
        {/* Back to Home Button */}
        <Link 
          href="/" 
          className="absolute top-8 left-8 text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md">
           {/* Decorative Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 animate-pulse duration-[3000ms]" />
          
          <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl relative">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 animate-gradient">
                Welcome Back
              </h1>
              <p className="text-slate-400 text-lg">Sign in to MemMart</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            {/* Google Sign-In Button */}
            <div className="space-y-6">
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-6 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
                    <span>Continue with Google</span>
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-slate-500 bg-black/40 backdrop-blur-xl">
                    Secure Authentication
                  </span>
                </div>
              </div>

              {/* Info */}
              <p className="text-center text-xs text-slate-500 leading-relaxed">
                By continuing, you agree to MemMart's <Link href="#" className="underline hover:text-slate-300">Terms of Service</Link> and <Link href="#" className="underline hover:text-slate-300">Privacy Policy</Link>.
              </p>
            </div>
          </div>
          
           {/* Footer Text */}
           <div className="text-center mt-8 space-y-2">
            <p className="text-slate-400 text-sm">
              New here? <Link href="/login" className="text-blue-400 hover:text-purple-400 font-medium transition-colors">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

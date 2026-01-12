"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/components/providers/AuthProvider";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { FileText, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSuccess = async (response: any) => {
    setError("");
    setIsLoading(true);

    try {
      const idToken = response.credential;
      
      // Sync with backend and auth context
      await login(idToken);

      // Redirect to dashboard or intended path
      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/dashboard";
      sessionStorage.removeItem("redirectAfterLogin");
      router.push(redirectPath);
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setError(err.message || "Google sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleError = () => {
    setError("Google Sign-In failed. Please try again.");
    setIsLoading(false);
  };

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen flex items-center justify-center px-4 relative">
        {/* Back to Home Button */}
        <Link 
          href="/" 
          className="absolute top-8 left-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2 group cursor-pointer"
        >
          <div className="p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 group-hover:bg-gray-50 dark:group-hover:bg-slate-800 transition-all shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 rounded-2xl p-8 shadow-xl relative">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-md">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Sign in to MemMart</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            {/* Google Sign-In Button */}
            <div className="space-y-6">
              {/* Loading state overlay */}
              {isLoading && (
                <div className="flex items-center justify-center gap-3 py-6">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  <span className="text-gray-600 dark:text-gray-300">Signing in...</span>
                </div>
              )}
              
              {!isLoading && (
                <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    width="100%"
                    logo_alignment="center"
                    text="continue_with"
                    useOneTap={false} // Explicitly disable One Tap to prevent looping
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-2 text-gray-600 dark:text-gray-400">
                    Secure Authentication
                  </span>
                </div>
              </div>

              {/* Info */}
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                By continuing, you agree to MemMart's <Link href="#" className="underline hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Terms of Service</Link> and <Link href="#" className="underline hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Privacy Policy</Link>.
              </p>
            </div>
          </div>
          
           {/* Footer Text */}
           <div className="text-center mt-8 space-y-2">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              New here? <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

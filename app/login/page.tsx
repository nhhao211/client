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
      <AnimatedBackground />
      <AnimatedBackground />
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] opacity-60 animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] opacity-50 animate-pulse delay-700" />
        </div>

        {/* Back to Home Button - Bubbly Clay */}
        {/* Back to Home Button - Bubbly Clay */}
        <Link 
          href="/" 
          className="absolute top-8 left-8 z-50"
        >
          <div className="clay-card !bg-white dark:!bg-gray-800 px-6 py-3 !rounded-full flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm text-foreground">Back to Home</span>
          </div>
        </Link>

        {/* Login Card - Playful Clay */}
        <div className="relative z-10 w-full max-w-md">
          <div className="clay-card p-12 relative overflow-hidden !rounded-[2.5rem]">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-tr from-primary to-accent rounded-[2rem] flex items-center justify-center shadow-inner transform rotate-3">
                  <FileText className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-black text-foreground mb-3 tracking-tight">
                Welcome Back!
              </h1>
              <p className="text-muted-foreground text-xl font-medium">Ready to create some magic?</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 bg-red-100/50 border-2 border-red-200 rounded-3xl text-red-600 text-sm flex items-center gap-3 font-bold">
                 <div className="w-3 h-3 rounded-full bg-red-500 animate-bounce" />
                {error}
              </div>
            )}

            {/* Google Sign-In Button */}
            <div className="space-y-8">
              {/* Loading state overlay */}
              {isLoading && (
                <div className="flex items-center justify-center gap-3 py-6">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
                  <span className="text-primary font-bold text-lg">Signing you in...</span>
                </div>
              )}
              
              {!isLoading && (
                <div className="flex justify-center w-full">
                  <div className="w-full transform transition-transform hover:-translate-y-1 hover:scale-[1.02]">
                     <GoogleLogin
                      onSuccess={handleSuccess}
                      onError={handleError}
                      theme="filled_blue"
                      size="large"
                      shape="pill"
                      width="100%"
                      logo_alignment="center"
                      text="continue_with"
                      useOneTap={false}
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t-2 border-dashed border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider font-extrabold">
                  <span className="bg-white px-4 text-muted-foreground/60">
                    Trusted & Secure
                  </span>
                </div>
              </div>

              {/* Info */}
              <p className="text-center text-sm text-muted-foreground font-medium leading-relaxed">
                By hopping in, you agree to MemMart's <Link href="#" className="text-primary hover:text-accent font-bold hover:underline transition-all">Terms</Link> and <Link href="#" className="text-primary hover:text-accent font-bold hover:underline transition-all">Privacy Policy</Link>.
              </p>
            </div>
          </div>
          
           {/* Footer Text */}
           <div className="text-center mt-10 space-y-2">
            <p className="text-muted-foreground font-bold">
              New here? <Link href="/login" className="text-primary hover:text-primary/80 font-black transition-colors underline decoration-wavy decoration-2">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

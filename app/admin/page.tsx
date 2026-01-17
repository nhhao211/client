"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, setAuthToken } from "@/services/authService";
import { createSession } from "@/app/actions";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await adminLogin(username, password);
      if (response.success && response.data.user) {
        // We might get a token in response.data (implied by plan) but interface LoginResponse doesn't explicitly show it in 'data.user'.
        // Wait, the LoginResponse interface in authService.ts has data: { user: ... }.
        // My server implementation returns data: { token, user }.
        // I need to make sure I grab the token. Check authService implementation again?
        // authService.ts: LoginResponse interface matches server response structure?
        // Server: { success: true, data: { token, user: {...} } }
        // Client Interface: interface LoginResponse { data: { user: ... } }
        // I might need to update the interface or cast it.
        // For now, let's assume the response contains what we need and use 'any' if strictly needed or just trust the response structure.
        
        // Actually, looking at authService.ts, LoginResponse doesn't explicitly have 'token'. 
        // But the server returns it. I should access it dynamically or update interface.
        // Let's just use (response.data as any).token for now to avoid compilation errors if I don't update interface.
        
        const token = (response.data as any).token;
        if (token) {
          setAuthToken(token);
          await createSession(token); // Sync cookie
          // Also save user info if needed
          localStorage.setItem("user", JSON.stringify(response.data.user));
          
          router.push("/dashboard");
        } else {
          setError("No token received");
        }
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Admin Login</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

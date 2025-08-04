"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let data, error;

    if (isLogin) {
      ({ data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      }));
    } else {
      ({ data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {},
      }));
    }

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/onboarding");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 max-w-md w-full mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">
        {isLogin ? "Welcome Back 👋" : "Create Your ShopLink Account 🚀"}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        {isLogin
          ? "Enter your credentials to access your store."
          : "Sign up with your email to start creating your store link."}
      </p>

      {error && (
        <div className="text-sm text-red-500 bg-red-100 p-2 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-2 duration-500"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-base h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-base h-10"
          />
        </div>

        <Button
          type="submit"
          className="w-full hover:brightness-110 transition"
          disabled={loading}
        >
          {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
        </Button>
      </form>

      <button
        type="button"
        className="mt-4 text-sm text-emerald-600 underline"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Don't have an account? Sign Up"
          : "Already have an account? Log In"}
      </button>
    </main>
  );
}

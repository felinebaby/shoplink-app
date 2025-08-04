"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
        options: {}, // you can add metadata later here
      }));
    }

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // ✅ optional: redirect to onboarding or dashboard
      router.push("/dashboard"); // or '/onboarding'
    }
  };

  return (
    <main className="max-w-sm mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold mb-6">
        {isLogin ? "Log In" : "Sign Up"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <button
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

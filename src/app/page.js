"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaFacebookF, FaLinkedinIn, FaGoogle, FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSocialLogin = async (provider) => {
    if (provider === 'google') {
      window.location.href = "http://localhost:3001/auth/google";
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);


    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();


      if (response.ok) {
        localStorage.setItem("token", data.token);
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        router.push("/frontpage");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <div className="bg-black rounded-2xl shadow-2xl flex flex-col md:flex-row w-full md:w-2/3 max-w-4xl">
          {/* Sign In Section */}
          <div className="w-full md:w-3/5 p-5">
            <div className="text-left font-bold">
              <span className="text-blue-500">Unisprint</span>
            </div>

            <form onSubmit={handleSubmit} className="py-10">
              <h2 className="text-3xl font-bold text-blue-500 mb-2">Sign in to Account</h2>
              <div className="border-2 w-10 border-blue-500 inline-block mb-4"></div>

              {/* Social Login Buttons */}
              <div className="flex justify-center my-2 space-x-2">
                {[
                  { icon: FaFacebookF, provider: "facebook" },
                  { icon: FaLinkedinIn, provider: "linkedin" },
                  { icon: FaGoogle, provider: "google" },
                ].map(({ icon: Icon, provider }) => (
                  <button
                    key={provider}
                    onClick={() => handleSocialLogin(provider)}
                    className="border-2 border-blue-500 rounded-full p-3 hover:bg-blue-500 hover:text-white transition-colors"
                    type="button"
                  >
                    <Icon className="text-sm" />
                  </button>
                ))}
              </div>

              <p className="text-gray-400 my-3">or use your email account</p>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Login Form */}
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-gray-100 w-64 p-2 flex items-center rounded">
                  <FaRegEnvelope className="text-gray-400 mr-2" />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="bg-gray-100 outline-none text-sm flex-1"
                    required
                  />
                </div>

                <div className="bg-gray-100 w-64 p-2 flex items-center rounded">
                  <MdLockOutline className="text-gray-400 mr-2" />
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="bg-gray-100 outline-none text-sm flex-1"
                    required
                  />
                </div>

                <div className="flex justify-between w-64">
                  <label className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="mr-1"
                    />
                    Remember me
                  </label>
                  <a href="#" className="text-xs text-blue-500 hover:underline">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="border-2 border-blue-500 rounded-full px-12 py-2 inline-block font-semibold 
                           hover:bg-blue-500 hover:text-white transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>

          {/* Sign Up Section */}
          <div className="w-full md:w-2/5 bg-blue-500 text-white rounded-b-2xl md:rounded-b-none md:rounded-r-2xl py-36 px-12">
            <h2 className="text-3xl font-bold mb-2">Join Today</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-8">Create an account today to interact with other students</p>
            <button
              onClick={() => router.push("/register")}
              className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold
                       hover:bg-white hover:text-blue-500 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
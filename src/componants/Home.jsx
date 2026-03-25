import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
  const authstatus = useSelector((state) => state.auth.status);

  return (
    <div className="bg-black text-white min-h-[80vh] flex items-center justify-center px-6">

      <div
        className="max-w-4xl w-full text-center flex flex-col gap-8
                   opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
      >

        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
          Write. Share. Grow.
        </h1>

        {/* Subheading */}
        <p className="text-gray-400 text-sm md:text-lg max-w-xl mx-auto">
          A minimal platform to express your ideas and explore thoughts from others.
        </p>

        {/* Auth Based Section */}
        {!authstatus ? (
          <div className="flex flex-col items-center gap-5">

            <p className="text-gray-300 text-sm md:text-base">
              Sign up to read and write blogs
            </p>

            <div className="flex gap-4">

              <NavLink
                to="/login"
                className="px-6 py-2 border border-gray-700 rounded 
                           hover:bg-white hover:text-black
                           transition-all duration-200 
                           hover:scale-105 active:scale-95"
              >
                Login
              </NavLink>

              <NavLink
                to="/sign-up"
                className="px-6 py-2 bg-white text-black rounded 
                           hover:bg-gray-200
                           transition-all duration-200 
                           hover:scale-105 active:scale-95"
              >
                Sign Up
              </NavLink>

            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">

            <p className="text-gray-300 text-sm md:text-base">
              Welcome back 👋 Ready to write something new?
            </p>

            <div className="flex gap-4">

              <NavLink
                to="/blogs"
                className="px-6 py-2 border border-gray-700 rounded 
                           hover:bg-white hover:text-black
                           transition-all duration-200 
                           hover:scale-105 active:scale-95"
              >
                Explore Blogs
              </NavLink>

              <NavLink
                to="/Write-blog"
                className="px-6 py-2 bg-white text-black rounded 
                           hover:bg-gray-200
                           transition-all duration-200 
                           hover:scale-105 active:scale-95"
              >
                Write Blog
              </NavLink>

            </div>
          </div>
        )}

        {/* Bottom subtle line */}
        <p className="text-xs text-gray-600 mt-6">
          Built for creators who love simplicity.
        </p>

      </div>

      {/* ✅ Inline animation (no config needed) */}
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

    </div>
  );
}

export default Home;
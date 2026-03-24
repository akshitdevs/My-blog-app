import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
  const authstatus = useSelector((state) => state.auth.status);

  return (
    <div className="bg-black text-white min-h-[80vh] flex items-center justify-center px-6">

      <div className="max-w-4xl w-full text-center flex flex-col gap-8">

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
              Login to read and write blogs
            </p>

            <div className="flex gap-4">
              <NavLink
                to="/login"
                className="px-6 py-2 border border-gray-700 rounded hover:bg-white hover:text-black transition"
              >
                Login
              </NavLink>

              <NavLink
                to="/sign-up"
                className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
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
                className="px-6 py-2 border border-gray-700 rounded hover:bg-white hover:text-black transition"
              >
                Explore Blogs
              </NavLink>

              <NavLink
                to="/Write-blog"
                className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
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
    </div>
  );
}

export default Home;
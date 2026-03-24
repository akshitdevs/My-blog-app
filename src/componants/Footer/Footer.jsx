import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../Logo";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useSelector } from "react-redux";
function Footer() {
  const authstatus = useSelector((state) => state.auth.status)
  return (
    <footer className="bg-black border-t border-white text-white px-6 md:px-16 py-10">

      {/* Main Container */}
      <div className="max-w-7xl mx-auto flex flex-col gap-10">

        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <Logo className="w-8" />
            <span className="text-base tracking-wide font-medium">
              RAWBLOGS
            </span>
          </div>

          {/* Nav Links */}
          <div className="flex gap-6 text-sm text-gray-400">

            <NavLink to="/" className="hover:text-white transition">
              Home
            </NavLink>

            {authstatus && (
              <>
                <NavLink to="/blogs" className="hover:text-white transition">
                  Blogs
                </NavLink>

                <NavLink to="/Write-blog" className="hover:text-white transition">
                  Write
                </NavLink>
              </>
            )}

            {!authstatus && (
              <>
                <NavLink to="/login" className="hover:text-white transition">
                  Login
                </NavLink>

                <NavLink to="/sign-up" className="hover:text-white transition">
                  Sign Up
                </NavLink>
              </>
            )}

          </div>

          {/* Social Icons */}
          <div className="flex gap-4 text-gray-400 text-lg">
            <a href="https://github.com/ankkuuu" className="hover:text-white transition">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/akshit-barthwal-5592b1287" className="hover:text-white transition">
              <FaLinkedin />
            </a>
            <a href="#" className="hover:text-white transition">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-3">
          <p>© {new Date().getFullYear()} RAWBLOGS</p>

          <div className="flex gap-5">
            <NavLink to="/privacy" className="hover:text-gray-300 transition">
              Privacy
            </NavLink>
            <NavLink to="/terms" className="hover:text-gray-300 transition">
              Terms
            </NavLink>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
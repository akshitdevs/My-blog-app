// pages/Signup.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Input from "../componants/Input";
import Button from "../componants/Button";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
import LoadingOverlay from "../componants/LoadingOverlay";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.createAccount(form);

      const currentUser = await authService.getCurrentUser();
      dispatch(login(currentUser));

      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-[80vh] flex items-center justify-center px-6 relative">

      {/* Loading */}
      {loading && <LoadingOverlay message="Creating account..." />}

      {/* Animated Container */}
      <div
        className="w-full max-w-md border border-gray-800 p-6 rounded shadow-md relative z-10
                   opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Button
            className="cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-white hover:underline transition"
          >
            Login
          </NavLink>
        </p>
      </div>

      {/* Inline Animation */}
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

export default Signup;
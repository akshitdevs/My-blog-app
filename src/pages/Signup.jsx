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
    setLoading(true); // 🔹 Start loading

    try {
      // ✅ Create account
      await authService.createAccount(form);

      // ✅ Get current user after signup
      const currentUser = await authService.getCurrentUser();
      dispatch(login(currentUser));

      navigate("/"); // ✅ Redirect after success
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false); // 🔹 Stop loading
    }
  };

  return (
    <div className="bg-black text-white min-h-[80vh] flex items-center justify-center px-6 relative">
      {/* 🔹 Loading overlay */}
      {loading && <LoadingOverlay message="Creating account..." />}

      <div className="w-full max-w-md border border-gray-800 p-6 rounded shadow-md relative z-10">
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

          <Button className=" cursor-pointer" type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account?{" "}
          <NavLink to="/login" className="text-white hover:underline">
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Signup;
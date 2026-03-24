import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import authService from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import LogoutModal from "../LogoutModal";

function LogoutBtn({ className = "" }) {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout(); // delete session
      dispatch(logout()); // clear redux
      setShowModal(false);
      navigate("/"); // redirect
    } catch (error) {
      console.log("Logout error", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`hover:bg-amber-50 hover:text-black px-3 md:px-6 rounded transition cursor-pointer ${className}`}
      >
        Logout
      </button>

      <LogoutModal
        isOpen={showModal}
        onConfirm={handleLogout}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}

export default LogoutBtn;
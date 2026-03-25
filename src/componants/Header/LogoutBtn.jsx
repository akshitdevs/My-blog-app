import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import authService from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import LogoutModal from "../LogoutModal";

function LogoutBtn({ className = "" }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ NEW
  const [fade, setFade] = useState(false); // ✅ NEW

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    setFade(true); // start fade

    try {
      await authService.logout();
      dispatch(logout());

      // smooth delay before redirect
      setTimeout(() => {
        setShowModal(false);
        navigate("/");
      }, 300);

    } catch (error) {
      console.log("Logout error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Fade wrapper */}
      <div className={`transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
        <button
          onClick={() => setShowModal(true)}
          className={`transition cursor-pointer ${className}`}
        >
          Logout
        </button>
      </div>

      <LogoutModal
        isOpen={showModal}
        onConfirm={handleLogout}
        onCancel={() => !loading && setShowModal(false)}
        loading={loading} // ✅ pass loading
      />
    </>
  );
}

export default LogoutBtn;
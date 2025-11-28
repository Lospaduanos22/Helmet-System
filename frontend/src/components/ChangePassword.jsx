// src/components/ChangePassword.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../services/ApiService";

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const student = location.state?.student;

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!student) {
    // If no student info, redirect to login
    navigate("/login");
    return null;
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ Send correct payload
      const response = await ApiService.changePassword(student.student_id, { newPassword });

      if (response.success) {
        alert("Password changed successfully!");
        setNewPassword("");

        // Redirect student to dashboard
        navigate("/student", { replace: true });
      } else {
        setError(response.message || "Failed to change password");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-gray-900 to-black">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          First Login: Change Password
        </h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <button
          onClick={handleChangePassword}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-400"
          }`}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </div>
    </div>
  );
}

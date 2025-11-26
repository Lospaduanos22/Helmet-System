// src/components/ChangePassword.jsx
import React, { useState } from "react";
import ApiService from "../services/ApiService";

export default function ChangePassword({ studentId, onPasswordChanged }) {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await ApiService.changePassword(studentId, newPassword);
      if (response.success) {
        alert("Password changed successfully!");
        setNewPassword("");
        onPasswordChanged();
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-6 bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl">
      <h3 className="text-xl font-bold text-white mb-4 text-center">
        Change Password (First Login)
      </h3>

      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full px-4 py-2 mb-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
      />

      {error && <p className="text-red-500 text-center mb-3">{error}</p>}

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
  );
}

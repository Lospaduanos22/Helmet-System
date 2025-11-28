import React, { useState } from "react";
import ApiService from "../services/ApiService";

export default function Profile({ student }) {
  const [username, setUsername] = useState(student?.username || "");
  const [password, setPassword] = useState("");

  const handleSave = async () => {
    try {
      const response = await ApiService.updateStudentProfile({
        studentId: student.student_id,
        username,
        password,
      });

      console.log(response);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      {/* Student ID (read only) */}
      <div className="mb-4">
        <label className="text-gray-300 text-sm">Student ID</label>
        <input
          value={student?.student_id}
          readOnly
          className="w-full mt-1 p-3 bg-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
        />
      </div>

      {/* Username */}
      <div className="mb-4">
        <label className="text-gray-300 text-sm">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mt-1 p-3 bg-gray-800 rounded-lg"
        />
      </div>

      {/* Password */}
      <div className="mb-6">
        <label className="text-gray-300 text-sm">New Password</label>
        <input
          type="password"
          placeholder="Leave empty if unchanged"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 p-3 bg-gray-800 rounded-lg"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold"
      >
        Save Changes
      </button>
    </div>
  );
}

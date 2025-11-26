import React, { useState, useEffect } from "react";
import ApiService from "../services/ApiService";

export default function StudentDashboard({ studentId }) {
  const [student, setStudent] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      const response = await ApiService.getStudent(studentId);
      if (response.success) {
        setStudent(response.student);
        if (response.student.first_login) setShowChangePassword(true);
      }
    };
    fetchStudent();
  }, [studentId]);

  const handlePasswordChange = async () => {
    if (newPassword.length < 8) return alert("Password must be at least 8 characters");
    const response = await ApiService.changePassword(studentId, newPassword);
    if (response.success) {
      alert("Password changed!");
      setShowChangePassword(false);
    } else alert(response.message);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl text-white">Welcome, {student?.username}</h2>

      {showChangePassword && (
        <div className="mt-4 p-4 bg-yellow-100 rounded">
          <p>Please change your password (first login)</p>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 rounded border"
          />
          <button
            onClick={handlePasswordChange}
            className="mt-2 bg-indigo-500 text-white p-2 rounded"
          >
            Change Password
          </button>
        </div>
      )}
    </div>
  );
}

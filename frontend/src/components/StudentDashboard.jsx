import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import StudentLockers from "./StudentLockers"; // Import the new component

export default function StudentDashboard({ studentId, onLogout }) {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("helmet");
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;
      try {
        const res = await ApiService.getStudent(studentId);
        if (res.success) {
          setStudent(res.student);
          setUsernameInput(res.student.username);

          if (res.student.first_login === 1) {
            navigate("/update-password", { state: { student: res.student } });
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudent();
  }, [studentId, navigate]);

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  const handleUpdateProfile = async () => {
    setMessage("");
    if (!student) return setMessage("Student not loaded yet");

    if (newPassword && newPassword.length < 8)
      return setMessage("Password must be at least 8 characters");

    if (usernameInput === student.username && !newPassword)
      return setMessage("No changes detected");

    try {
      const payload = {};
      if (usernameInput !== student.username) payload.username = usernameInput;
      if (newPassword) {
        if (!oldPassword) return setMessage("Enter current password to change password");
        payload.password = newPassword;
        payload.oldPassword = oldPassword;
      }

      const res = await ApiService.updateStudentProfile(student.student_id, payload);

      if (res.success) {
        alert(res.message || "Profile updated successfully");
        setOldPassword("");
        setNewPassword("");
        setStudent((prev) => ({ ...prev, username: payload.username || prev.username }));
      } else {
        setMessage(res.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <nav className="w-full bg-gray-900/70 backdrop-blur-md shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white tracking-wide">Student Dashboard</h1>

        <div className="flex items-center space-x-6">
          <p className="text-gray-300 text-sm hidden md:block">Hello, <span className="font-semibold text-blue-400">{student?.username}</span></p>

          {/* Tabs */}
          <button
            className={`text-sm md:text-base font-semibold transition-colors duration-200 ${
              activeTab === "helmet" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("helmet")}
          >
            Locker Deposit
          </button>

          <button
            className={`text-sm md:text-base font-semibold transition-colors duration-200 ${
              activeTab === "profile" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>

          {/* Logout */}
          <button
            onClick={handleLogoutClick}
            className="bg-red-600/90 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 md:p-10">
        {activeTab === "helmet" && (
          // Pass the student object so we can check if they already have a reservation
          <StudentLockers student={student} />
        )}

        {activeTab === "profile" && (
          <div className="max-w-lg mx-auto bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">My Profile</h2>
            {message && <p className={`text-center mb-4 p-2 rounded ${message.includes("success") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{message}</p>}

            <div className="mb-4">
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider ml-1">Student ID</label>
              <input
                value={student?.student_id || ""}
                readOnly
                className="w-full mt-1 p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider ml-1">Username</label>
              <input
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full mt-1 p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider ml-1">Current Password</label>
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Required for changes"
                className="w-full mt-1 p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="showOld"
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  checked={showOldPassword}
                  onChange={(e) => setShowOldPassword(e.target.checked)}
                />
                <label htmlFor="showOld" className="ml-2 text-sm text-gray-400 cursor-pointer">Show Password</label>
              </div>
            </div>

            <div className="mb-8">
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider ml-1">New Password</label>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="w-full mt-1 p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="showNew"
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  checked={showNewPassword}
                  onChange={(e) => setShowNewPassword(e.target.checked)}
                />
                <label htmlFor="showNew" className="ml-2 text-sm text-gray-400 cursor-pointer">Show Password</label>
              </div>
            </div>

            <button
              onClick={handleUpdateProfile}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold shadow-lg transform active:scale-95 transition-all"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
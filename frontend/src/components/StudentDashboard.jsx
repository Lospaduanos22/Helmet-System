import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";

export default function StudentDashboard({ studentId, onLogout }) {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("helmet");
  const [slots, setSlots] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

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

  // Initialize lockers
  useEffect(() => {
    const initialSlots = Array(100)
      .fill(null)
      .map((_, i) => ({ name: `Locker ${i + 1}`, taken: false }));
    setSlots(initialSlots);
  }, []);

  // Pagination
  const start = currentPage * 25;
  const pageSlots = slots.slice(start, start + 25);

  const handleNext = () => {
    const totalPages = Math.ceil(slots.length / 25);
    setCurrentPage((currentPage + 1) % totalPages);
  };

  const handlePrev = () => {
    const totalPages = Math.ceil(slots.length / 25);
    setCurrentPage((currentPage - 1 + totalPages) % totalPages);
  };

  const handleSelectSlot = (index) => {
    if (slots[index].taken) return;
    const updated = [...slots];
    updated[index] = { ...updated[index], taken: true, studentId, time: new Date().toISOString() };
    setSlots(updated);
  };

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
      <nav className="w-full bg-gray-900/70 backdrop-blur-md shadow-lg px-6 py-4 flex justify-between items-center">
  <h1 className="text-xl font-bold">Student Dashboard</h1>

  <div className="flex items-center space-x-6">
    <p className="text-gray-300">Hello, {student?.username}</p>

    {/* Tabs */}
    <button
      className={`text-lg font-semibold transition ${
        activeTab === "helmet" ? "text-blue-400" : "text-gray-300 hover:text-blue-400"
      }`}
      onClick={() => setActiveTab("helmet")}
    >
      Helmet Deposit
    </button>

    <button
      className={`text-lg font-semibold transition ${
        activeTab === "profile" ? "text-blue-400" : "text-gray-300 hover:text-blue-400"
      }`}
      onClick={() => setActiveTab("profile")}
    >
      Profile
    </button>

    {/* Logout */}
    <button
      onClick={handleLogoutClick}
      className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 font-semibold"
    >
      Logout
    </button>
  </div>
</nav>


      <div className="p-8">
        {activeTab === "helmet" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Available Lockers</h2>
            <div className="grid grid-cols-5 gap-3">
              {pageSlots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSlot(start + idx)}
                  className={`p-6 rounded-xl font-bold text-center ${
                    slot.taken ? "bg-red-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {slot.name} <br /> {slot.taken ? "Unavailable" : "Available"}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrev}
                className="w-1/2 py-3 mr-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
              >
                Previous Page
              </button>
              <button
                onClick={handleNext}
                className="w-1/2 py-3 ml-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg font-semibold"
              >
                Next Page
              </button>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-lg mx-auto bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6">My Profile</h2>
            {message && <p className="text-red-400 mb-4">{message}</p>}

            <div className="mb-4">
              <label className="text-gray-300 text-sm">Student ID</label>
              <input
                value={student?.student_id}
                readOnly
                className="w-full mt-1 p-3 bg-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-300 text-sm">Username</label>
              <input
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full mt-1 p-3 bg-gray-800 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-300 text-sm">Current Password</label>
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full mt-1 p-3 bg-gray-800 rounded-lg"
              />
              <div className="mt-1">
                <label className="text-gray-300 text-sm">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={showOldPassword}
                    onChange={(e) => setShowOldPassword(e.target.checked)}
                  />
                  Show Password
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-gray-300 text-sm">New Password</label>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank if unchanged"
                className="w-full mt-1 p-3 bg-gray-800 rounded-lg"
              />
              <div className="mt-1">
                <label className="text-gray-300 text-sm">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={showNewPassword}
                    onChange={(e) => setShowNewPassword(e.target.checked)}
                  />
                  Show Password
                </label>
              </div>
            </div>

            <button
              onClick={handleUpdateProfile}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

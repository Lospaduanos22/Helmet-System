import React, { useState, useEffect } from "react";
import ApiService from "../services/ApiService";

export default function StudentDashboard({ studentId, onLogout }) {
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("helmet"); // helmet | profile
  const [slots, setSlots] = useState([]);

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;

      try {
        const response = await ApiService.getStudent(studentId);
        if (response.success) setStudent(response.student);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudent();
  }, [studentId]);

  // Fetch slots (for demo, generate dummy 100 lockers)
  useEffect(() => {
    const initialSlots = Array(100)
      .fill(null)
      .map((_, i) => ({ name: `Locker ${i + 1}`, taken: false }));
    setSlots(initialSlots);
  }, []);

  const handleSelectSlot = (index) => {
    if (slots[index].taken) return;

    const updated = [...slots];
    updated[index] = { ...updated[index], taken: true, studentId, time: new Date().toISOString() };
    setSlots(updated);

    // TODO: Save selected slot to backend
    console.log("Slot selected:", index, updated[index]);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  // Pagination for 5x5 grid
  const [currentPage, setCurrentPage] = useState(0);
  const handleNext = () => {
    const totalPages = Math.ceil(slots.length / 25);
    setCurrentPage((currentPage + 1) % totalPages);
  };

  const start = currentPage * 25;
  const pageSlots = slots.slice(start, start + 25);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* NAVBAR */}
      <nav className="w-full bg-gray-900/70 backdrop-blur-md shadow-lg px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Student Dashboard</h1>

        <div className="flex space-x-6">
          <button
            className={`hover:text-blue-400 transition ${
              activeTab === "helmet" ? "text-blue-400" : ""
            }`}
            onClick={() => setActiveTab("helmet")}
          >
            Helmet Deposit
          </button>

          <button
            className={`hover:text-blue-400 transition ${
              activeTab === "profile" ? "text-blue-400" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="ml-4 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
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
                  className={`p-6 rounded-xl font-bold transition shadow-lg text-center ${
                    slot.taken ? "bg-red-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {slot.name} <br /> {slot.taken ? "Unavailable" : "Available"}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="mt-6 w-full py-3 bg-indigo-500 hover:bg-indigo-400 rounded-lg font-semibold shadow-md transition"
            >
              Next Locker Page
            </button>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-lg mx-auto bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6">My Profile</h2>

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
                value={student?.username || ""}
                onChange={(e) => setStudent({ ...student, username: e.target.value })}
                className="w-full mt-1 p-3 bg-gray-800 rounded-lg"
              />
            </div>

            <div className="mb-6">
              <label className="text-gray-300 text-sm">New Password</label>
              <input
                type="password"
                placeholder="Leave empty if unchanged"
                onChange={(e) => setStudent({ ...student, password: e.target.value })}
                className="w-full mt-1 p-3 bg-gray-800 rounded-lg"
              />
            </div>

            <button
              onClick={async () => {
                try {
                  const response = await ApiService.updateStudentProfile(student);
                  alert(response.message || "Profile updated!");
                } catch (err) {
                  console.error(err);
                  alert("Error updating profile");
                }
              }}
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

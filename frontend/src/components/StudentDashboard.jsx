import React, { useState, useEffect } from "react";
import ApiService from "../services/ApiService";
import ChangePassword from "./ChangePassword";

export default function StudentDashboard({ studentId, onLogout }) {
  const [student, setStudent] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      // Debug: log studentId before fetch
      console.log("StudentDashboard: fetchStudent called with studentId:", studentId);

      if (!studentId) {
        console.warn("No studentId provided, cannot fetch student");
        return;
      }

      try {
        const response = await ApiService.getStudent(studentId);
        console.log("StudentDashboard: getStudent response:", response);

        if (response.success) {
          const s = response.student;
          const firstLogin = s.first_login == 1 ? true : false;
          setStudent({ ...s, first_login: firstLogin });

          if (firstLogin) setShowChangePassword(true);
        } else {
          console.error("Failed to fetch student:", response.message);
        }
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };

    if (studentId) fetchStudent();
  }, [studentId]);

  const handlePasswordChanged = () => {
    setShowChangePassword(false);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        {showChangePassword ? (
          <ChangePassword 
            studentId={studentId}
            onPasswordChanged={handlePasswordChanged}
          />
        ) : (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white">
                Hello, {student?.username}!
              </h1>
              <p className="text-gray-300 mt-1">Welcome to your dashboard</p>
            </div>

            <div className="text-center">
              <p className="text-gray-300">You are logged in.</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3 mt-6 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold shadow-md transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

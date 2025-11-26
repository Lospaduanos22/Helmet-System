// src/App.jsx
import React, { Component } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";

class App extends Component {
  state = { user: null, role: null, studentId: null };

  handleLogin = (role, userData) => {
    this.setState({ user: userData, role, studentId: userData?.id || null });
  };

  handleLogout = () => {
    this.setState({ user: null, role: null, studentId: null });
  };

  render() {
    const { user, role, studentId } = this.state;

    return (
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={!user ? <Login onLogin={this.handleLogin} /> : <Navigate to={role === "admin" ? "/admin" : "/student"} />}
        />

        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            user && role === "admin" ? (
              <AdminDashboard onLogout={this.handleLogout} user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/student"
          element={user && role === "student" ? (
            <StudentDashboard studentId={studentId} />
          ) : (
            <Navigate to="/login" />
          )}
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
}

export default App;

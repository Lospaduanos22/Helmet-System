import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";

class App extends Component {
  state = { user: null, role: null, studentId: null, loading: true };

  componentDidMount() {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedStudentId = localStorage.getItem("studentId");

    // Debug: log localStorage values on mount
    console.log("App mount: storedUser", storedUser);
    console.log("App mount: storedRole", storedRole);
    console.log("App mount: storedStudentId", storedStudentId);

    if (storedUser && storedRole) {
      this.setState({
        user: JSON.parse(storedUser),
        role: storedRole,
        studentId: storedStudentId || null,
        loading: false,
      });
    } else {
      this.setState({ loading: false });
    }
  }

  handleLogin = (role, userData) => {
    const studentId = userData.student_id || null;

    // Debug: log login response
    console.log("handleLogin called with:", { role, userData, studentId });

    this.setState(
      { user: userData, role, studentId },
      () => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", role);
        if (role === "student" && studentId) {
          localStorage.setItem("studentId", studentId);
        }

        // Debug: confirm after setState & localStorage
        console.log("State after login:", this.state);
        console.log("LocalStorage after login:", {
          user: localStorage.getItem("user"),
          role: localStorage.getItem("role"),
          studentId: localStorage.getItem("studentId"),
        });
      }
    );
  };

  handleLogout = () => {
    this.setState({ user: null, role: null, studentId: null }, () => {
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("studentId");
      // Debug: confirm logout
      console.log("Logged out, localStorage cleared");
    });
  };

  render() {
    const { user, role, studentId, loading } = this.state;

    if (loading) return <div className="text-white p-6">Loading...</div>;

    return (
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route
            path="/login"
            element={
              !user ? <Login onLogin={this.handleLogin} /> : <Navigate to="/" replace />
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              user && role === "admin" ? (
                <AdminDashboard onLogout={this.handleLogout} user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Student */}
          <Route
            path="/student"
            element={
              user && role === "student" ? (
                <StudentDashboard studentId={studentId} onLogout={this.handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Default */}
          <Route
            path="/"
            element={
              user ? (
                role === "admin" ? <Navigate to="/admin" replace /> : <Navigate to="/student" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;

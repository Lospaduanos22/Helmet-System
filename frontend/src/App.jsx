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

    if (storedUser && storedRole) {
      this.setState({
        user: JSON.parse(storedUser),
        role: storedRole,
        studentId: storedStudentId,
        loading: false,
      });
    } else {
      this.setState({ loading: false });
    }
  }

  handleLogin = (role, userData) => {
    this.setState(
      { user: userData, role, studentId: userData?.id || null },
      () => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", role);
        if (role === "student") localStorage.setItem("studentId", userData.id);
      }
    );
  };

  handleLogout = () => {
    this.setState({ user: null, role: null, studentId: null }, () => {
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("studentId");
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
              !user ? (
                <Login onLogin={this.handleLogin} />
              ) : (
                <Navigate to="/" replace />
              )
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
                role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/student" replace />
                )
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

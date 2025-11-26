// src/App.jsx
import React, { Component } from "react";
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

        if (!user) {
            return <Login onLogin={this.handleLogin} />;
        }

        return (
            <div className="min-h-screen bg-gray-100">
                <div className="flex justify-end p-4">
                    <button
                        onClick={this.handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
                {role === "admin" && <AdminDashboard />}
                {role === "student" && <StudentDashboard studentId={studentId} />}
            </div>
        );
    }
}

export default App;

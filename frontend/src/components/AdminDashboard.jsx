// src/components/AdminDashboard.jsx
import React, { Component } from "react";
import ApiService from "../services/ApiService";

class AdminDashboard extends Component {
    state = { username: "", password: "", message: "" };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleCreateStudent = async (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        try {
            const response = await ApiService.createStudent(username, password);
            if (response.success) {
                this.setState({ message: "Student created successfully!", username: "", password: "" });
            } else {
                this.setState({ message: response.message });
            }
        } catch (err) {
            this.setState({ message: "Server error." });
        }
    };

    render() {
        const { username, password, message } = this.state;
        return (
            <div className="p-8 max-w-md mx-auto bg-white shadow rounded mt-10">
                <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
                <form onSubmit={this.handleCreateStudent} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={this.handleChange}
                        placeholder="Student Username"
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={this.handleChange}
                        placeholder="Student Password"
                        className="w-full border p-2 rounded"
                        required
                    />
                    <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        Create Student
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-red-500">{message}</p>}
            </div>
        );
    }
}

export default AdminDashboard;

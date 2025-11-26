// src/components/Login.jsx
import React, { Component } from "react";
import ApiService from "../services/ApiService";
import { useNavigate } from "react-router-dom";

class Login extends Component {
  state = { username: "", password: "", role: "student", error: "" };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, role } = this.state;
    try {
      const response = await ApiService.login(username, password, role);
      if (response.success) {
        // Redirect based on role
        if (role === "admin") this.props.navigate("/admindashboard");
        else this.props.navigate("/studentdashboard");
      } else {
        alert(response.message); // Wrong credentials
        this.setState({ error: response.message });
      }
    } catch (err) {
      alert("Server error. Please try again later.");
      console.error(err);
    }
  };

  render() {
    const { username, password, role, error } = this.state;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
        <div className="w-full max-w-sm bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <img
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              alt="Logo"
              className="mx-auto h-12 w-auto"
            />
            <h2 className="mt-6 text-2xl font-bold text-white">
              Sign in to your account
            </h2>
          </div>

          <form onSubmit={this.handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={this.handleChange}
                required
                placeholder="Enter your username"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={this.handleChange}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={this.handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-indigo-500 hover:bg-indigo-400 rounded-lg text-white font-semibold shadow-md transition"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400 text-sm">
            Not a member?{" "}
            <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>
    );
  }
}

// Wrapper to use navigate in class component
export default function LoginWithNavigate(props) {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
}

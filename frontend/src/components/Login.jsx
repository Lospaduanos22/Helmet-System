import React, { Component } from "react";
import ApiService from "../services/ApiService";

class Login extends Component {
  state = { 
    username: "", 
    password: "", 
    role: "student", 
    error: "", 
    showPassword: false // state for toggling password visibility
  };

  // Handle input changes for username, password, and role
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: "" });
  };

  // Toggle password visibility
  togglePassword = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };

  // Handle form submission
  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, role } = this.state;

    try {
      const response = await ApiService.login(username, password, role);

      if (response.success) {
        this.props.onLogin(role, response.data);
      } else {
        this.setState({ error: response.message });
      }
    } catch (err) {
      this.setState({ error: "Server error. Please try again later." });
      console.error(err);
    }
  };

  render() {
    const { username, password, role, error, showPassword } = this.state;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
        <div className="w-full max-w-sm bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <img
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              alt="Logo"
              className="mx-auto h-12 w-auto"
            />
            <h2 className="mt-6 text-2xl font-bold text-white">Sign in to your account</h2>
          </div>

          <form onSubmit={this.handleSubmit} className="mt-8 space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                name="username"
                type="text"
                value={username}
                onChange={this.handleChange}
                required
                placeholder="Enter your username"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={this.handleChange}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
              {/* Show Password checkbox */}
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="showPasswordCheckbox"
                  checked={showPassword}
                  onChange={this.togglePassword}
                  className="mr-2"
                />
                <label htmlFor="showPasswordCheckbox" className="text-sm text-gray-300">
                  Show Password
                </label>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Role
              </label>
              <select
                name="role"
                value={role}
                onChange={this.handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Error message */}
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-indigo-500 hover:bg-indigo-400 rounded-lg text-white font-semibold shadow-md transition"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;

import React, { Component } from "react";
import ApiService from "../services/ApiService";
import { useNavigate } from "react-router-dom";

// HOC to provide navigate to class component
function withRouter(Component) {
  return function (props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

class AdminDashboard extends Component {
  state = {
    studentID: "",
    username: "",
    createdBy: "",
    message: "",
  };

  componentDidMount() {
    if (this.props.user) {
      this.setState({ createdBy: this.props.user.username });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, message: "" });
  };

  handleCreateStudent = async (e) => {
    e.preventDefault();
    const { studentID, username, createdBy } = this.state;

    if (!studentID || !username || !createdBy) {
      return this.setState({ message: "All fields are required" });
    }

    try {
      const response = await ApiService.createStudent({
        student_id: studentID, // match backend key
        username,
        createdBy,
      });

      if (response.success) {
        this.setState({
          message: response.message,
          studentID: "",
          username: "",
          createdBy: this.props.user.username, // keep admin prefilled
        });
      } else {
        this.setState({ message: response.message });
      }
    } catch (err) {
      console.error(err);
      this.setState({ message: "Server error." });
    }
  };

  handleLogout = () => {
    this.props.onLogout();
    this.props.navigate("/login");
  };

  render() {
    const { studentID, username, createdBy, message } = this.state;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
        <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Admin Dashboard
          </h2>

          <form onSubmit={this.handleCreateStudent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Student ID
              </label>
              <input
                name="studentID"
                type="text"
                value={studentID}
                onChange={this.handleChange}
                placeholder="Enter Student ID"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                name="username"
                type="text"
                value={username}
                onChange={this.handleChange}
                placeholder="Enter Username"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Admin Name
              </label>
              <input
                name="createdBy"
                type="text"
                value={createdBy}
                onChange={this.handleChange}
                placeholder="Enter Admin Name"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            {message && <p className="text-center text-red-500 mt-2">{message}</p>}

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-indigo-500 hover:bg-indigo-400 rounded-lg text-white font-semibold shadow-md transition"
            >
              Create Student
            </button>

            <button
              type="button"
              onClick={this.handleLogout}
              className="w-full py-3 mt-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold shadow-md transition"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(AdminDashboard);

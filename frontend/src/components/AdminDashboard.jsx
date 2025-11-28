import React, { Component } from "react";
import ApiService from "../services/ApiService";
import { useNavigate } from "react-router-dom";
import ManageLockers from "./ManageLockers"; // <-- import the existing component

// HOC to provide navigate to class component
function withRouter(Component) {
  return function (props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

// AdminDashboard
class AdminDashboard extends Component {
  state = {
    studentID: "",
    username: "",
    createdBy: "",
    message: "",
    activeTab: "createStudent", // createStudent | manageLockers | manageStudents
    selectedStudentID: "",
    newPassword: "",
  };

  componentDidMount() {
    if (this.props.user) {
      this.setState({ createdBy: this.props.user.username });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, message: "" }, () => {
      if (e.target.name === "selectedStudentID" && this.state.selectedStudentID) {
        this.fetchUsername(this.state.selectedStudentID);
      }
    });
  };

  fetchUsername = async (studentID) => {
    try {
      const response = await ApiService.getStudent(studentID);
      if (response.success) {
        this.setState({ username: response.student.username });
      } else {
        this.setState({ username: "Not Found" });
      }
    } catch (err) {
      console.error(err);
      this.setState({ username: "Error" });
    }
  };

  handleCreateStudent = async (e) => {
    e.preventDefault();
    const { studentID, username, createdBy } = this.state;

    if (!studentID || !username || !createdBy) {
      return this.setState({ message: "All fields are required" });
    }

    try {
      const response = await ApiService.createStudent({ student_id: studentID, username, createdBy });
      this.setState({ message: response.message || "Student created", studentID: "", username: "" });
    } catch (err) {
      console.error(err);
      this.setState({ message: "Server error." });
    }
  };

  handleChangePassword = async (e) => {
    e.preventDefault();
    const { selectedStudentID, newPassword } = this.state;

    if (!selectedStudentID || !newPassword) return alert("Enter Student ID and new password");
    if (newPassword.length < 8) return alert("Password must be at least 8 characters");

    try {
      const response = await ApiService.adminChangeStudentPassword(selectedStudentID, newPassword);
      alert(response.message || "Password changed successfully");
      this.setState({ selectedStudentID: "", newPassword: "", username: "" });
    } catch (err) {
      console.error(err);
      alert(err.message || "Server error");
    }
  };

  handleLogout = () => {
    this.props.onLogout();
    this.props.navigate("/login");
  };

  render() {
    const { studentID, username, createdBy, message, activeTab, selectedStudentID, newPassword } = this.state;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
        {/* NAVBAR */}
        <nav className="w-full bg-gray-900/70 backdrop-blur-md shadow-lg px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex space-x-6">
            <button
              className={`hover:text-blue-400 transition ${activeTab === "createStudent" ? "text-blue-400" : "text-white"}`}
              onClick={() => this.setState({ activeTab: "createStudent" })}
            >
              Create Student
            </button>

            <button
              className={`hover:text-blue-400 transition ${activeTab === "manageLockers" ? "text-blue-400" : "text-white"}`}
              onClick={() => this.setState({ activeTab: "manageLockers" })}
            >
              Manage Lockers
            </button>

            <button
              className={`hover:text-blue-400 transition ${activeTab === "manageStudents" ? "text-blue-400" : "text-white"}`}
              onClick={() => this.setState({ activeTab: "manageStudents" })}
            >
              Manage Students
            </button>

            <button onClick={this.handleLogout} className="ml-4 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600">
              Logout
            </button>
          </div>
        </nav>

        <div className="flex justify-center items-start mt-8 w-full">
          {activeTab === "createStudent" && (
            <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
              <form onSubmit={this.handleCreateStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Student ID</label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Admin Name</label>
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
              </form>
            </div>
          )}

          {activeTab === "manageLockers" && <ManageLockers adminName={createdBy} />} {/* <-- use ManageLockers */}

          {activeTab === "manageStudents" && (
            <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-white">Change Student Password</h2>
              <form onSubmit={this.handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Student ID</label>
                  <input
                    type="text"
                    name="selectedStudentID"
                    value={selectedStudentID}
                    onChange={this.handleChange}
                    placeholder="Enter Student ID"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <p className="text-gray-300">Username: {username || "Not found"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                  <input
                    type={this.state.showPassword ? "text" : "password"}
                    name="newPassword"
                    value={newPassword}
                    onChange={this.handleChange}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                  />
                  <div className="mt-2 flex items-center">
                    <input
                      type="checkbox"
                      id="showPassword"
                      checked={this.state.showPassword || false}
                      onChange={() => this.setState({ showPassword: !this.state.showPassword })}
                      className="mr-2 accent-indigo-500"
                    />
                    <label htmlFor="showPassword" className="text-white select-none">
                      Show Password
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-md transition"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(AdminDashboard);

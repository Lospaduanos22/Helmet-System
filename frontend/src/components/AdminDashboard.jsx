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

// LockerGrid with global locker names
class LockerGrid extends Component {
  state = {
    currentPage: 0,
    lockers: [
      { name: "Main Locker", slots: Array(25).fill(null) },
      { name: "Backup Locker", slots: Array(25).fill(null) },
      // add more lockers as needed
    ],
  };

  handleNext = () => {
    const totalPages = this.state.lockers.length;
    this.setState({ currentPage: (this.state.currentPage + 1) % totalPages });
  };

  handleCheckout = (index) => {
    const slotsCopy = [...this.state.lockers];
    const slot = slotsCopy[this.state.currentPage].slots[index];
    if (slot && slot.taken) return;

    slotsCopy[this.state.currentPage].slots[index] = {
      taken: true,
      admin: this.props.adminName,
      time: new Date().toISOString(),
    };
    this.setState({ lockers: slotsCopy });
  };

  handleRenameLocker = () => {
    const newName = prompt("Enter new locker name:", this.state.lockers[this.state.currentPage].name);
    if (!newName) return;

    const lockersCopy = [...this.state.lockers];
    lockersCopy[this.state.currentPage].name = newName;
    this.setState({ lockers: lockersCopy });
  };

  render() {
    const locker = this.state.lockers[this.state.currentPage];
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">{locker.name}</h2>
        <div className="grid grid-cols-5 gap-3">
          {locker.slots.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => this.handleCheckout(idx)}
              className={`w-full p-6 rounded-xl font-bold transition shadow-lg text-center ${
                slot?.taken ? "bg-red-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {locker.name}-{idx + 1} <br /> {slot?.taken ? "Checked Out" : "Available"}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={this.handleRenameLocker}
            className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
          >
            Rename Locker
          </button>
          <button
            onClick={this.handleNext}
            className="py-2 px-4 bg-indigo-500 hover:bg-indigo-400 rounded-lg text-white"
          >
            Next Locker
          </button>
        </div>
      </div>
    );
  }
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

    try {
      const response = await ApiService.adminChangeStudentPassword(selectedStudentID, newPassword);
      alert(response.message || "Password changed!");
      this.setState({ selectedStudentID: "", newPassword: "", username: "" });
    } catch (err) {
      console.error(err);
      alert("Error changing password");
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
                  <input name="studentID" type="text" value={studentID} onChange={this.handleChange} placeholder="Enter Student ID" className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                  <input name="username" type="text" value={username} onChange={this.handleChange} placeholder="Enter Username" className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Admin Name</label>
                  <input name="createdBy" type="text" value={createdBy} onChange={this.handleChange} placeholder="Enter Admin Name" className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
                </div>

                {message && <p className="text-center text-red-500 mt-2">{message}</p>}

                <button type="submit" className="w-full py-3 mt-4 bg-indigo-500 hover:bg-indigo-400 rounded-lg text-white font-semibold shadow-md transition">Create Student</button>
              </form>
            </div>
          )}

          {activeTab === "manageLockers" && <LockerGrid adminName={createdBy} />}

          {activeTab === "manageStudents" && (
            <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-white">Change Student Password</h2>
              <form onSubmit={this.handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Student ID</label>
                  <input type="text" name="selectedStudentID" value={selectedStudentID} onChange={this.handleChange} placeholder="Enter Student ID" className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
                </div>

                <div>
                  <p className="text-gray-300">Username: {username || "Not found"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                  <input type="password" name="newPassword" value={newPassword} onChange={this.handleChange} placeholder="Enter new password" className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
                </div>

                <button type="submit" className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-md transition">Update Password</button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(AdminDashboard);

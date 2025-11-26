class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  // Login
  async login(username, password, role) {
    const res = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  }

  // Create Student
  async createStudent(data) {
    const res = await fetch("http://localhost:5000/api/students/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: data.student_id, // must match backend key
        username: data.username,
        createdBy: data.createdBy,
      }),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  }

  // Get student by ID
  async getStudent(studentId) {
    const res = await fetch(`http://localhost:5000/api/students/${studentId}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  }

  // Change password
  async changePassword(studentId, newPassword) {
    const res = await fetch(
      `http://localhost:5000/api/students/change-password/${studentId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      }
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  }
}

export default new ApiService("http://localhost:5000/api/users");

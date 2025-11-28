class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async login(username, password, role) {
    const res = await fetch(`${this.baseUrl}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || `HTTP error! status: ${res.status}`);
    return result;
  }

  async createStudent(data) {
    const res = await fetch(`${this.baseUrl}/students/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: data.student_id,
        username: data.username,
        createdBy: data.createdBy,
      }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || `HTTP error! status: ${res.status}`);
    return result;
  }

  async getStudent(studentId) {
    const res = await fetch(`${this.baseUrl}/students/${studentId}`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || `HTTP error! status: ${res.status}`);
    return result;
  }

 async changePassword(studentId, payload) {
  const res = await fetch(`${this.baseUrl}/students/change-password/${studentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let result;
  try {
    result = await res.json();
  } catch (e) {
    throw new Error(`Invalid JSON response from server. Status: ${res.status}`);
  }

  if (!res.ok) throw new Error(result.message || `HTTP error! status: ${res.status}`);
  return result;
}


  async updateStudentProfile(studentId, payload) {
    const res = await fetch(`${this.baseUrl}/students/update/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || `HTTP error! status: ${res.status}`);
    return result;
  }

  async adminChangeStudentPassword(studentId, newPassword) {
    const res = await fetch(`${this.baseUrl}/admin/change-student-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: studentId, newPassword }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || `HTTP error! status: ${res.status}`);
    return result;
  }
}

export default new ApiService("http://localhost:5000/api");

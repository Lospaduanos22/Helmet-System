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

  // --- LOCKER METHODS ---

  async getAllLockers() {
    const res = await fetch(`${this.baseUrl}/lockers`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || `HTTP error! status: ${res.status}`);
    return result;
  }

  async addLocker(lockerNumber) {
    const res = await fetch(`${this.baseUrl}/lockers/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locker_number: lockerNumber }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || `HTTP error! status: ${res.status}`);
    return result;
  }

  async renameLocker(lockerId, newName) {
    const res = await fetch(`${this.baseUrl}/lockers/rename`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locker_id: lockerId, new_name: newName }),
    });
    return res.json();
  }

  async deleteLocker(lockerId) {
    const res = await fetch(`${this.baseUrl}/lockers/delete/${lockerId}`, {
      method: "DELETE",
    });
    return res.json();
  }

  async reserveLocker(lockerId, studentId) {
    const res = await fetch(`${this.baseUrl}/lockers/reserve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locker_id: lockerId, student_id: studentId }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || `HTTP error! status: ${res.status}`);
    return result;
  }

  async adminCheckout(lockerId) {
    const res = await fetch(`${this.baseUrl}/lockers/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locker_id: lockerId }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || `HTTP error! status: ${res.status}`);
    return result;
  }
}

// Using 127.0.0.1:5001 based on previous fixes
export default new ApiService("http://127.0.0.1:5001/api");
/*
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
*/
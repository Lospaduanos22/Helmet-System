// src/services/ApiService.js
class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async login(username, password, role) {
        const res = await fetch(`${this.baseUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, role })
        });
        return await res.json();
    }

    async createStudent(username, password) {
        const res = await fetch(`${this.baseUrl}/admin/create-student`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        return await res.json();
    }

    async changePassword(studentId, newPassword) {
        const res = await fetch(`${this.baseUrl}/student/change-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId, newPassword })
        });
        return await res.json();
    }
}

export default new ApiService("http://localhost:5000/api");

class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async login(username, password, role) {
    // Updated baseUrl to point to /users since your route is /api/users/login
    const res = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });

    // Check if the response is OK before parsing JSON
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  }
}

// Update baseUrl to match backend route prefix
export default new ApiService("http://localhost:5000/api/users");

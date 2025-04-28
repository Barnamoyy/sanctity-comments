export const userService = {
  async createUser(userData: {
    creatorUserId: string;
    name: string;
    email: string;
    imageUrl: string;
  }) {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response;
  },

  async getUsers() {
    const response = await fetch("/api/getUser");
    return response.json();
  }
}; 
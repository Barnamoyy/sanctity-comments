export const threadService = {
  async createThread(creatorUserId: string, content: string) {
    const response = await fetch("/api/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        creatorUserId,
        content: content.trim(),
      }),
    });
    return response;
  },

  async getThreads() {
    const response = await fetch("/api/getThreads");
    return response.json();
  }
}; 
export const commentService = {
  async createComment(data: {
    threadId: string;
    userId: string;
    content: string;
    parentCommentId?: string;
  }) {
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response;
  },

  async getComments(threadId: string) {
    const response = await fetch(`/api/comments/${threadId}`);
    return response.json();
  }
}; 
export const editService = {
  async updateComment(data: { id: string; content: string }) {
    try {
      const response = await fetch(`/api/edit/${data.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: data.content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update comment");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in updateComment service:", error);
      throw error;
    }
  },
};

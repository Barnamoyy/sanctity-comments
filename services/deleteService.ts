export const deleteService = {
    async deletePost(data: { id: string }) {
      try {
        const response = await fetch(`/api/delete/${data.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update comment");
        }
        
        // Check if there's content to parse
      if (response.status === 204) {
        return { success: true }; // Return a default success object
      }

        return await response.json();
      } catch (error) {
        console.error("Error in deleteComment service:", error);
        throw error;
      }
    },
  };
  
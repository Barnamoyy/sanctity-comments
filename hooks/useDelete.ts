import { useState } from "react";
import { Comment } from "@/types/thread";
import { deleteService } from "@/services/deleteService";

export const useDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteComment = async (commentId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await deleteService.deletePost({
        id: commentId
      });
      
      return result;
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError(error instanceof Error ? error : new Error("Failed to delete comment"));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    deleteComment
  };
};

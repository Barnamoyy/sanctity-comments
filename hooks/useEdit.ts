import { useState } from "react";
import { Comment } from "@/types/thread";
import { editService } from "@/services/editService";

export const useEdit = () => {
  const [comment, setComment] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateComment = async (data: { id: string; content: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedComment = await editService.updateComment({
        ...data,
      });
      
      setComment(updatedComment);
      return updatedComment;
    } catch (error) {
      console.error("Error updating comment:", error);
      setError(error instanceof Error ? error : new Error("Failed to update comment"));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    comment,
    loading,
    error,
    updateComment,
  };
};

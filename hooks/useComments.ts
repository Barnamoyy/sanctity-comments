import { useState } from "react";
import { Comment } from "@/types/thread";
import { commentService } from "@/services/commentService";

export const useComments = (threadId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const getComments = async () => {
    try {
      const data = await commentService.getComments(threadId);
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const createComment = async (data: {
    userId: string;
    content: string;
    parentCommentId?: string;
  }) => {
    setLoading(true);
    try {
      await commentService.createComment({
        threadId,
        ...data,
      });
      await getComments();
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const createReply = async (data: {
    userId: string;
    content: string;
    parentCommentId: string;
  }) => {
    setLoading(true);
    try {
      await commentService.createComment({
        threadId,
        ...data,
      });
      await getComments();
    } catch (error) {
      console.error("Error creating reply:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    comments,
    loading,
    getComments,
    createComment,
    createReply,
  };
}; 
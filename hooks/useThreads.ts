import { useState } from "react";
import { Thread } from "@/types/thread";
import { threadService } from "@/services/threadService";

export const useThreads = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);

  const getThreads = async () => {
    try {
      const data = await threadService.getThreads();
      setThreads(data);
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  const createThread = async (creatorUserId: string, content: string) => {
    setLoading(true);
    try {
      await threadService.createThread(creatorUserId, content);
      await getThreads();
    } catch (error) {
      console.error("Error creating thread:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    threads,
    loading,
    getThreads,
    createThread,
  };
}; 
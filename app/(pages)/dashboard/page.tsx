"use client";

// hooks
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useThreads } from "@/hooks/useThreads";
import { useUsers } from "@/hooks/useUsers";
import { useRouter } from "next/navigation";

// components
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

// utils
import { formatDate } from "@/utils/dateUtils";

// icons
import { MessageCircle } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const { user } = useUser();
  const { threads, loading, getThreads, createThread } = useThreads();
  const { getUsers, createUser, getThreadUser } = useUsers();

  // post thread
  const handlePostThread = async () => {
    if (!user || !content.trim()) return;
    await createThread(user.id, content);
    setContent("");
  };

  // Load threads and users on mount
  useEffect(() => {
    getThreads();
    getUsers();
  }, []);

  // Store user when user data is available
  useEffect(() => {
    if (user) {
      createUser({
        creatorUserId: user.id,
        name: user.fullName || "Anonymous User",
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
      });
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="w-full h-fit p-2 lg:p-4 flex flex-row justify-start items-start gap-x-4">
        <img
          src={user.imageUrl}
          className="hidden lg:block rounded-full w-[24px] lg:w-[36px] h-auto"
          alt={user.fullName || "User"}
        />
        <div className="w-full h-full flex flex-col justify-center items-center gap-y-4">
          <Textarea
            className="border-none text-sm lg:text-lg w-full min-h-30"
            placeholder="What's Happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="w-full flex flex-row justify-between items-center">
            {loading ? (
              <h4 className="text-sm lg:text-md lg:text-lg font-regular text-slate-500 max-w-2/3">
                Creating new thread...
              </h4>
            ) : (
              <h4 className="text-sm lg:text-md lg:text-lg font-regular text-slate-500 max-w-2/3">
                Everyone will be able to see your comment.
              </h4>
            )}
            <Button
              className="text-white text-sm lg:text-md font-bold bg-blue-600 px-4 py-2 lg:px-6 lg:py-4 rounded-full"
              onClick={handlePostThread}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
      <Separator />
      {threads.map((thread) => (
        <div
          key={thread.id}
          className="flex flex-col justify-center items-center"
        >
          <Separator />
          <Card className="w-full h-full py-6" onClick={() => router.push(`/thread/${thread.id}`)}>
            <CardContent className="px-6">
              <div className="flex flex-row justify-start items-center">
                {thread.comments && thread.comments.length > 0 ? (
                  <div className="flex items-start gap-4 w-full">
                    <img
                      src={getThreadUser(thread.creatorUserId)?.imageUrl}
                      alt="User avatar"
                      className="w-[36px] h-auto rounded-full"
                    />
                    <div className="w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-md font-bold">
                          {getThreadUser(thread.creatorUserId)?.name}
                        </span>
                        <span className="text-md text-gray-500">
                          {formatDate(thread.createdAt)}
                        </span>
                      </div>
                      <p className="text-md">{thread.comments[0].content}</p>
                      <div className="flex flex-row justify-end items-center">
                        <MessageCircle className="text-slate-700 cursor-pointer w-5 h-auto" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Page;

"use client";

// hooks
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, use } from "react";
import { useThreads } from "@/hooks/useThreads";
import { useUsers } from "@/hooks/useUsers";
import { useComments } from "@/hooks/useComments";
import { useEdit } from "@/hooks/useEdit";
import { useDelete } from "@/hooks/useDelete";
import { useRouter } from "next/navigation";

// components
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// utils
import { formatDate } from "@/utils/dateUtils";
import {
  MoveLeft,
  MessageCircle,
  Pencil,
  ChevronDown,
  ChevronUp,
  Delete,
} from "lucide-react";

// types
import { Comment } from "@/types/thread";

const ThreadPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();

  // states
  const [content, setContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [collapsedComments, setCollapsedComments] = useState<Set<string>>(
    new Set()
  );
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  //hooks
  const { user } = useUser();
  if (user) {
    const userId = user.id;
  }

  const { threads, getThreads } = useThreads();
  const { getUsers, createUser, getThreadUser } = useUsers();
  const { id } = use(params);
  const { comments, loading, getComments, createComment, createReply } =
    useComments(id);
  const { updateComment, loading: editLoading } = useEdit();
  const { deleteComment, loading: deleteLoading } = useDelete();

  const currentThread = threads.find((thread) => thread.id === id);

  useEffect(() => {
    getThreads();
    getUsers();
    getComments();
  }, []);

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

  const handleSubmit = async () => {
    if (!user) return;

    if (replyTo) {
      if (!replyContent.trim()) return;

      await createReply({
        userId: user.id,
        content: replyContent.trim(),
        parentCommentId: replyTo,
      });
      setReplyContent("");
    } else {
      if (!content.trim()) return;

      await createComment({
        userId: user.id,
        content: content.trim(),
      });
      setContent("");
    }

    setReplyTo(null);
  };

  const handleReply = (commentId: string) => {
    setReplyTo(commentId);
  };

  const handleEditClick = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleEditSubmit = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      await updateComment({
        id: commentId,
        content: editContent.trim(),
      });

      // Refresh comments after edit
      getComments();

      // Reset edit state
      setEditingCommentId(null);
      setEditContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteModal = (commentId?: string) => {
    setIsOpenDelete(!isOpenDelete);
    if (commentId) {
      setCommentToDelete(commentId);
    } else {
      setCommentToDelete(null);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setIsOpenDelete(false)
      getComments();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleCollapse = (commentId: string) => {
    setCollapsedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const renderComment = (
    comment: Comment,
    level: number = 0,
    isEditable: boolean
  ) => (
    <div key={comment.id} className={`${level > 0 ? "ml-8" : ""}`}>
      <Card className="">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4 w-full">
            <img
              src={getThreadUser(comment.userId)?.imageUrl}
              alt="User avatar"
              className="w-[36px] h-auto rounded-full"
            />
            <div className="w-full">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  {getThreadUser(comment.userId)?.name}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm mt-2">{comment.content}</p>
              <div className="flex justify-start mt-2 gap-2">
                <div className="flex flex-row justify-center items-center">
                  <MessageCircle className="text-slate-600" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReply(comment.id)}
                    className="text-sm"
                  >
                    Reply
                  </Button>
                </div>
                {new Date(comment.createdAt).getTime() + 15 * 60 * 1000 >
                  new Date().getTime() &&
                  user?.id === comment.userId && (
                    <>
                      <div className="flex flex-row justify-center items-center">
                        <Pencil className="text-slate-600" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(comment)}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="flex flex-row justify-center items-center">
                        <Delete className="text-slate-600" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-sm"
                          onClick={() => handleDeleteModal(comment.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                {comment.replies && comment.replies.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCollapse(comment.id)}
                    className="flex items-center gap-1 text-sm"
                  >
                    {collapsedComments.has(comment.id) ? (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        <span className="hidden sm:inline">Show Replies</span>
                      </>
                    ) : (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        <span className="hidden sm:inline">Hide Replies</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {editingCommentId === comment.id && (
        <div className="ml-8 mb-4 mt-4">
          <div className="flex items-start gap-4">
            <div className="w-full">
              <Textarea
                className="text-sm"
                placeholder="Edit your comment..."
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="flex justify-end items-center mt-2 gap-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingCommentId(null)}
                  className="bg-slate-900 px-4 py-2 rounded-full font-bold text-sm text-white"
                >
                  Cancel
                </Button>
                <Button
                  className="text-white text-sm font-bold bg-blue-600 px-4 py-2 rounded-full"
                  onClick={() => handleEditSubmit(comment.id)}
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {replyTo === comment.id && (
        <div className="ml-8 mb-4 mt-4">
          <div className="flex items-start gap-4">
            <div className="w-full">
              <Textarea
                className="text-sm"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="flex justify-end items-center mt-2 gap-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyTo(null)}
                  className="bg-slate-900 px-4 py-2 rounded-full font-bold text-sm text-white"
                >
                  Cancel
                </Button>
                <Button
                  className="text-white text-sm font-bold bg-blue-600 px-4 py-2 rounded-full"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {comment.replies &&
        comment.replies.length > 0 &&
        !collapsedComments.has(comment.id) && (
          <div className="space-y-4">
            {comment.replies.map((reply: any) =>
              renderComment(reply, level + 1, isEditable)
            )}
          </div>
        )}

      {/* At the bottom of your main return */}
      <Dialog open={isOpenDelete} onOpenChange={() => handleDeleteModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              comment and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-x-4 w-full justify-center lg:justify-start items-center">
            <Button onClick={() => handleDeleteModal()}>Cancel</Button>
            <Button
              onClick={() => commentToDelete && handleDelete(commentToDelete)}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  if (!user || !currentThread) {
    return null;
  }

  return (
    <div className="p-2 lg:p-4">
      <MoveLeft
        onClick={() => router.push("/dashboard")}
        className="text-slate-600"
      />
      {/* Main Thread */}
      <Card className="mb-10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4 w-full">
            <img
              src={getThreadUser(currentThread.creatorUserId)?.imageUrl}
              alt="User avatar"
              className="w-[36px] h-auto rounded-full"
            />
            <div className="w-full">
              <div className="flex items-center gap-2">
                <span className="text-md font-semibold text-slate-400">
                  {getThreadUser(currentThread.creatorUserId)?.name}
                </span>
                <span className="text-md text-gray-500">
                  {formatDate(currentThread.createdAt)}
                </span>
              </div>
              {currentThread.comments && currentThread.comments.length > 0 && (
                <p className="text-3xl font-bold mt-2">
                  {currentThread.comments[0].content}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thread Reply Form */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <div className="w-full">
            <Textarea
              className="text-sm"
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Button
                className="text-white text-sm font-bold bg-blue-600 px-4 py-2 rounded-full"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Comments List */}
      <div>{comments.map((comment) => renderComment(comment, 0, true))}</div>
    </div>
  );
};

export default ThreadPage;

export interface Comment {
    id: string;
    threadId: string;
    userId: string;
    parentCommentId?: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    parentComment?: Comment;
    replies: Comment[];
} 

export interface CommentProps {
    comment: any;
    level?: number;
    onReply: (commentId: string) => void;
    onToggleCollapse: (commentId: string) => void;
    isCollapsed: boolean;
    getUser: (userId: string) => any;
  }
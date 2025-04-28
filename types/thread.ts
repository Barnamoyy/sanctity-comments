export interface Thread {
    id: string;
    creatorUserId: string;
    createdAt: Date;
    comments: Comment[];
}

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
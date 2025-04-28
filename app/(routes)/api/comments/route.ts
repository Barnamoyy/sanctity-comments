import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

import { notifyOnReply } from "../../../../services/notificationService"; // 1. Import the notification logic

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { threadId, userId, content, parentCommentId } = body;

    if (!threadId || !userId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        threadId,
        userId,
        content,
        parentCommentId,
      },
      include: {
        replies: true,
      },
    });

    if (parentCommentId) {
      await notifyOnReply(newComment.id);
    }

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 
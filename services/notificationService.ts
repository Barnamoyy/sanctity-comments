import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

export async function notifyOnReply(replyCommentId: string) {
  const reply = await prisma.comment.findUnique({
    where: { id: replyCommentId },
    include: { parentComment: true },
  });

  if (!reply || !reply.parentComment) return;

  if (reply.userId === reply.parentComment.userId) return;

  await prisma.notification.create({
    data: {
      userId: reply.parentComment.userId,
      commentId: reply.id,
      message: `You have a new reply to your comment: "${reply.content.slice(0, 50)}"`,
    },
  });
}
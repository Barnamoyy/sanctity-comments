import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient()

export async function POST(
  request: Request,
  { params }: { params: Promise<{postId: string }> }
) {
  const {postId} = await params;
  try {
    const deletedPost = await prisma.comment.delete({
      where: {
        id: postId
      }
    });
    return NextResponse.json(deletedPost);
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to delete comment" }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

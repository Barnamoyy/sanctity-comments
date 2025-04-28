import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request, {params}:{params: Promise<{commentId: string }>}) {
    const {commentId} = await params
    const body = await req.json()
  try {
    const updatedComment = await prisma.comment.update({
        where: {
            id: commentId
        },
        data: {
            content: body.content,
        }
    })
    return NextResponse.json(updatedComment)
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({error: error}), ({status: 500}))
  }
} 
import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { creatorUserId, content } = body;

    if (!creatorUserId) {
      return NextResponse.json({ error: "Missing creatorUserId" }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }

    const newThread = await prisma.thread.create({
      data: {
        creatorUserId,
        comments: {
          create: {
            userId: creatorUserId,
            content: content,
          }
        }
      },
      include: {
        comments: true
      }
    });

    return NextResponse.json(newThread, { status: 201 });
  } catch (error) {
    console.error("Error creating thread:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

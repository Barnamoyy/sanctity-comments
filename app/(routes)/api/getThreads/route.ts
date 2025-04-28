import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient()

export async function GET() {
    try {
        const threads = await prisma.thread.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                comments: true,
            },
        });

        return NextResponse.json(threads, { status: 200 });
        
    } catch (error) {
        console.error("Error fetching threads:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
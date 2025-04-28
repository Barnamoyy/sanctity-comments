import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

import { useUser } from '@clerk/nextjs';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
const {user} = useUser()
if (!user) {
    return new Response(JSON.stringify("error"))
} 
  const userId = user.id
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(notifications);
}
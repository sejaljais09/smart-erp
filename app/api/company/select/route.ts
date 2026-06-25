import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { companyId } = await req.json();

  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      currentCompanyId: companyId,
    },
  });

  return NextResponse.json({
    success: true,
  });
}
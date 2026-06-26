import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json([]);
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user?.currentCompanyId) {
    return NextResponse.json([]);
  }

  const ledgers =
    await prisma.ledger.findMany({
      where: {
        companyId:
          user.currentCompanyId,
      },
      orderBy: {
        name: "asc",
      },
    });

  return NextResponse.json(
    ledgers
  );
}
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json([]);
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!dbUser?.currentCompanyId) {
    return NextResponse.json([]);
  }

  const vouchers =
    await prisma.purchaseVoucher.findMany({
      where: {
        companyId:
          dbUser.currentCompanyId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  return NextResponse.json(vouchers);
}
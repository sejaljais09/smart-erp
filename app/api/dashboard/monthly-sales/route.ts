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

  const sales = await prisma.salesVoucher.findMany({
    where: {
      companyId: user.currentCompanyId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const monthly: Record<string, number> = {};

  sales.forEach((sale) => {
    const month = sale.createdAt.toLocaleString("en-IN", {
      month: "short",
    });

    monthly[month] =
      (monthly[month] || 0) + sale.totalAmount;
  });

  return NextResponse.json(
    Object.entries(monthly).map(([month, total]) => ({
      month,
      total,
    }))
  );
}
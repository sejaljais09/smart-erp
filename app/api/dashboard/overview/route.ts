import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email ?? "",
    },
  });

  if (!user?.currentCompanyId) {
    return NextResponse.json(
      { error: "No company selected" },
      { status: 400 }
    );
  }

  const companyId = user.currentCompanyId;

  const recentSales = await prisma.salesVoucher.findMany({
  where: {
    companyId: user.currentCompanyId,
  },
  take: 5,
  orderBy: {
    createdAt: "desc",
  },
  include: {
    items: {
      include: {
        stockItem: true,
      },
    },
  },
});

  const recentPurchases =
  await prisma.purchaseVoucher.findMany({
    where: {
      companyId: user.currentCompanyId,
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          stockItem: true,
        },
      },
    },
  });

  const lowStock =
    await prisma.stockItem.findMany({
      where: {
        companyId,
        currentQty: {
          lte: 5,
        },
      },
      orderBy: {
        currentQty: "asc",
      },
    });

  return NextResponse.json({
    recentSales,
    recentPurchases,
    lowStock,
  });
}
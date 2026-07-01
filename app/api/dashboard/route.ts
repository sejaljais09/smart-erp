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

  const [
    sales,
    purchases,
    customers,
    suppliers,
    items,
  ] = await Promise.all([
    prisma.salesVoucher.aggregate({
      where: { companyId },
      _sum: {
        totalAmount: true,
      },
    }),

    prisma.purchaseVoucher.aggregate({
      where: { companyId },
      _sum: {
        totalAmount: true,
      },
    }),

    prisma.customer.count({
      where: { companyId },
    }),

    prisma.supplier.count({
      where: { companyId },
    }),

    prisma.stockItem.count({
      where: { companyId },
    }),
  ]);

  return NextResponse.json({
    totalSales:
      sales._sum.totalAmount || 0,

    totalPurchase:
      purchases._sum.totalAmount || 0,

    customers,

    suppliers,

    items,
  });
}
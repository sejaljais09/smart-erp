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

  const products = await prisma.salesItem.groupBy({
    by: ["stockItemId"],

    _sum: {
      qty: true,
    },

    orderBy: {
      _sum: {
        qty: "desc",
      },
    },

    take: 5,
  });

  const result = await Promise.all(
    products.map(async (p) => {
      const item =
        await prisma.stockItem.findUnique({
          where: {
            id: p.stockItemId,
          },
        });

      return {
        name: item?.name,
        qty: p._sum.qty,
      };
    })
  );

  return NextResponse.json(result);
}
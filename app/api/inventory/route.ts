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

  const {
    name,
    sku,
    unit,
    gstPercent,
    openingQty,
    openingRate,
  } = await req.json();

  if (!name.trim()) {
    return NextResponse.json(
      { error: "Item name required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email ?? "",
    },
  });

  if (!user?.currentCompanyId) {
    return NextResponse.json(
      { error: "Select company first" },
      { status: 400 }
    );
  }

  const existing =
    await prisma.stockItem.findFirst({
      where: {
        companyId:
          user.currentCompanyId,
        name,
      },
    });

  if (existing) {
    return NextResponse.json(
      { error: "Item already exists" },
      { status: 400 }
    );
  }

  const item =
    await prisma.stockItem.create({
      data: {
        name,
        sku,
        unit,
        gstPercent,
        openingQty,
        openingRate,
          currentQty: openingQty,
        companyId:
          user.currentCompanyId,
      },
    });

  return NextResponse.json(item);
}
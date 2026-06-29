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

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user?.currentCompanyId) {
    return NextResponse.json(
      { error: "Select company first" },
      { status: 400 }
    );
  }

  const {
    name,
    phone,
    email,
    gstin,
    address,
    openingBalance,
  } = await req.json();

  if (!name.trim()) {
    return NextResponse.json(
      { error: "supplier name required" },
      { status: 400 }
    );
  }

  const existing =
    await prisma.supplier.findFirst({
      where: {
        companyId: user.currentCompanyId,
        name,
      },
    });

  if (existing) {
    return NextResponse.json(
      { error: "suppliers already exists" },
      { status: 400 }
    );
  }

  const supplier =
    await prisma.supplier.create({
      data: {
        name,
        phone,
        email,
        gstin,
        address,
        openingBalance:
          Number(openingBalance) || 0,
        companyId:
          user.currentCompanyId,
      },
    });

  return NextResponse.json(supplier);
}
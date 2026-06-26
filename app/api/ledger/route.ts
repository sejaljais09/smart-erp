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
    groupName,
    openingBal,
  } = await req.json();

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user?.currentCompanyId) {
    return NextResponse.json(
      { error: "Select a company first" },
      { status: 400 }
    );
  }

  if (!name || name.trim() === "") {
  return NextResponse.json(
    { error: "Ledger name required" },
    { status: 400 }
  );
}
const existing = await prisma.ledger.findFirst({
  where: {
    companyId: user.currentCompanyId,
    name,
  },
});

if (existing) {
  return NextResponse.json(
    { error: "Ledger already exists" },
    { status: 400 }
  );
}

  const ledger = await prisma.ledger.create({
    data: {
      name,
      groupName,
      openingBal,
      companyId: user.currentCompanyId,
    },
  });

  return NextResponse.json(ledger);
}
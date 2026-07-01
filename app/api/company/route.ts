import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, gstin } = await req.json();

    if (!name || name.trim() === "") {
  return NextResponse.json(
    { error: "Company name is required" },
    { status: 400 }
  );
}
    
    console.log("SESSION:", session);
    console.log("USER:", session?.user);

    const dbUser = await prisma.user.findUnique({
      where: {
        email: session.user?.email ?? "",
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const count = await prisma.company.count({
  where: {
    ownerId: dbUser.id,
  },
});

if (count >= 5) {
  return NextResponse.json(
    { error: "Maximum 5 companies allowed" },
    { status: 400 }
  );
}

    const company = await prisma.company.create({
      data: {
        name,
        gstin,
        ownerId: dbUser.id,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
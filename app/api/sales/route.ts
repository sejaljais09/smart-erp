import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!dbUser?.currentCompanyId) {
      return NextResponse.json(
        { error: "Select company first" },
        { status: 400 }
      );
    }

    const { partyName, totalAmount } =
      await req.json();

    if (!partyName) {
      return NextResponse.json(
        { error: "Party name required" },
        { status: 400 }
      );
    }

    const lastVoucher =
      await prisma.salesVoucher.findFirst({
        where: {
          companyId:
            dbUser.currentCompanyId,
        },
        orderBy: {
          voucherNo: "desc",
        },
      });

    const voucherNo =
      (lastVoucher?.voucherNo || 0) + 1;

    const voucher =
      await prisma.salesVoucher.create({
        data: {
          companyId:
            dbUser.currentCompanyId,
          voucherNo,
          partyName,
          totalAmount:
            Number(totalAmount) || 0,
        },
      });

    return NextResponse.json(voucher);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
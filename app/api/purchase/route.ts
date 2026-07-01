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
        email: session.user?.email ?? "",
      },
    });

    if (!dbUser?.currentCompanyId) {
      return NextResponse.json(
        { error: "Select company first" },
        { status: 400 }
      );
    }

    const {
  partyName,
  stockItemId,
  qty,
  rate,
  totalAmount,
} = await req.json();

    
     console.log("BODY DATA:", {
  partyName,
  stockItemId,
  qty,
  rate,
  totalAmount,
   });

    if (!partyName.trim()) {
      return NextResponse.json(
        { error: "Party Name required" },
        { status: 400 }
      );
    }

    const lastVoucher =
      await prisma.purchaseVoucher.findFirst({
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
      await prisma.purchaseVoucher.create({
        data: {
          voucherNo,
          partyName,
          totalAmount,
          companyId:
            dbUser.currentCompanyId,
        },
      });
      await prisma.purchaseItem.create({
            data: {
             voucherId: voucher.id,
              stockItemId,
              qty,
              rate,
              amount: totalAmount,
             },
        });
    console.log("STOCK ITEM:", stockItemId);
    console.log("QTY:", qty);

     const updated = await prisma.stockItem.update({
         where: {
           id: stockItemId,
        },
         data: {
           currentQty: {
           increment: qty,
           },
        },
   });

console.log("UPDATED STOCK:", updated);
console.log("TYPE OF QTY:", typeof qty);

    return NextResponse.json(voucher);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
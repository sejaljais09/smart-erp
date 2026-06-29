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

    const { customerId, totalAmount,rows ,} =  await req.json();

    if (!customerId) {
      return NextResponse.json(
        { error: "select customer" },
        { status: 400 }
      );
    }
    if (!rows || rows.length === 0) {
  return NextResponse.json(
    { error: "No items added" },
    { status: 400 }
  );
}  
   const customer = await prisma.customer.findFirst({
    where: {
      id: customerId,
      companyId:dbUser.currentCompanyId,
    },
  });

  if (!customer) {
  return NextResponse.json(
    { error: "Customer not found" },
    { status: 400 }
  );
}

    const lastVoucher = await prisma.salesVoucher.findFirst({
        where: {
          companyId:
            dbUser.currentCompanyId,
        },
        orderBy: {
          voucherNo: "desc",
        },
      });

    const voucherNo =(lastVoucher?.voucherNo || 0) + 1;
    
    for (const row of rows) {
       const item = await prisma.stockItem.findUnique({
      where: {
        id: row.stockItemId,
      },
    });

  if (!item) {
    return NextResponse.json(
      { error: "Item not found" },
      { status: 400 }
    );
  }

  if (item.currentQty < row.qty) {
    return NextResponse.json(
      {
        error: `${item.name} has only ${item.currentQty} in stock`,
      },
      { status: 400 }
    );
  }
}

   const voucher = await prisma.$transaction(
  async (tx) => {
    const voucher =
      await tx.salesVoucher.create({
        data: {
          companyId: dbUser.currentCompanyId,
          voucherNo,
           customerId: customer.id,
           partyName: customer.name,
          totalAmount:
            Number(totalAmount) || 0,
        },
      });

    for (const row of rows) {
      await tx.salesItem.create({
        data: {
          voucherId: voucher.id,
          stockItemId: row.stockItemId,
          qty: Number(row.qty),
          rate: Number(row.rate),
          amount:
            Number(row.qty) *
            Number(row.rate),
        },
      });
    }

    for (const row of rows) {
      await tx.stockItem.update({
        where: {
          id: row.stockItemId,
        },
        data: {
          currentQty: {
            decrement: Number(row.qty),
          },
        },
      });
    }

    return voucher;
  }
);

return NextResponse.json(voucher);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
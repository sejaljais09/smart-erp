import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const { id } = await params;
  const voucher =
    await prisma.salesVoucher.findUnique({
      where: {
        id,
      },
      include: {
        items: {
          include: {
            stockItem: true,
          },
        },
      },
    });

  if (!voucher) {
    notFound();
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Sales Invoice
      </h1>

      <div className="mt-6">
        <p>
          <strong>Invoice No:</strong>{" "}
          {voucher.voucherNo}
        </p>

        <p>
          <strong>Customer:</strong>{" "}
          {voucher.partyName}
        </p>
      </div>

      <table className="w-full border mt-6">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {voucher.items.map((item) => (
            <tr key={item.id}>
              <td>{item.stockItem.name}</td>
              <td>{item.qty}</td>
              <td>{item.rate}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 text-xl font-bold">
        Grand Total: ₹
        {voucher.totalAmount}
      </div>
      <PrintButton />
    </div>
  );
}
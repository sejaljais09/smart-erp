"use client";

import { useEffect, useState } from "react";

export default function SalesPage() {
  const [partyName, setPartyName] =
    useState("");

  const [totalAmount, setTotalAmount] =
    useState("");

  const [vouchers, setVouchers] =
    useState([]);

   const [rows, setRows] = useState([
  {
    itemName: "",
    qty: 1,
    rate: 0,
  },
]);

function addRow() {
  setRows([
    ...rows,
    {
      itemName: "",
      qty: 1,
      rate: 0,
    },
  ]);
}

function updateRow(
  index: number,
  field: string,
  value: any
) {
  const updated = [...rows];

  updated[index] = {
    ...updated[index],
    [field]: value,
  };

  setRows(updated);
}

  async function loadVouchers() {
    const res = await fetch(
      "/api/sales/list"
    );

    const data = await res.json();

    setVouchers(data);
  }

  async function createVoucher() {

    if (!partyName.trim()) {
  alert("Party Name is required");
  return;
}

if (grandTotal <= 0) {
  alert("Total Amount must be greater than 0");
  return;
}
    const res = await fetch(
      "/api/sales",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          partyName,
          totalAmount:grandTotal,
        }),
      }
    );

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setPartyName("");
    setTotalAmount("");

    loadVouchers();
  }

  useEffect(() => {
    loadVouchers();
  }, []);
  
  const grandTotal = rows.reduce(
  (sum, row) =>
    sum + Number(row.qty) * Number(row.rate),
  0
);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Sales Voucher
      </h1>

      <div className="mt-6">
  <input
    placeholder="Party Name"
    className="border p-2 mb-4 w-full"
    value={partyName}
    onChange={(e) =>
      setPartyName(e.target.value)
    }
  />

  <table className="w-full border">
    <thead>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Rate</th>
        <th>Amount</th>
      </tr>
    </thead>

    <tbody>
      {rows.map((row, index) => (
        <tr key={index}>
          <td>
            <input
              className="border p-1 w-full"
              value={row.itemName}
              onChange={(e) =>
                updateRow(
                  index,
                  "itemName",
                  e.target.value
                )
              }
            />
          </td>

          <td>
            <input
              type="number"
              className="border p-1"
              value={row.qty}
              onChange={(e) =>
                updateRow(
                  index,
                  "qty",
                  Number(e.target.value)
                )
              }
            />
          </td>

          <td>
            <input
              type="number"
              className="border p-1"
              value={row.rate}
              onChange={(e) =>
                updateRow(
                  index,
                  "rate",
                  Number(e.target.value)
                )
              }
            />
          </td>

          <td>
            {row.qty * row.rate}
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  <button
    onClick={addRow}
    className="bg-blue-600 text-white px-4 py-2 mt-4"
  >
    Add Item
  </button>

  <div className="mt-4 text-xl font-bold">
    Grand Total: ₹{grandTotal}
  </div>

  <button
    onClick={createVoucher}
    className="bg-black text-white px-4 py-2 mt-4 ml-4"
  >
    Save Voucher
  </button>
</div>

      <div className="mt-10">
        {vouchers.map((v: any) => (
          <div
            key={v.id}
            className="border p-3 mb-2"
          >
            <h2>
              Voucher #{v.voucherNo}
            </h2>

            <p>{v.partyName}</p>

            <p>
              ₹ {v.totalAmount}
            </p>
            
          </div>
        ))}
      </div>
    </div>
  );
}
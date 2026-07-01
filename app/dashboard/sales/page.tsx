"use client";

import { useEffect, useState } from "react";

export default function SalesPage() {
  

   const [vouchers, setVouchers] = useState<any[]>([]);
   const [items, setItems] = useState<any[]>([]);
   const [customers, setCustomers] = useState<any[]>([]);
   const [customerId, setCustomerId] = useState("");

   const [rows, setRows] = useState<Array<{ stockItemId: string; qty: number; rate: number; gst: number }>>([
  {
    stockItemId: "",
    qty: 1,
    rate: 0,
    gst:0,
  },
]);

function addRow() {
  setRows([
    ...rows,
    {
      stockItemId: "",
      qty: 1,
      rate: 0,
      gst:0,
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
  async function loadItems() {
  const res = await fetch("/api/inventory/list");
  const data = await res.json();
  setItems(data);
}

  async function createVoucher() {
    if (!customerId) {
  alert("Party select a customer");
  return;
}
    if (
    rows.some(
      (row) =>
        !row.stockItemId ||
        row.qty <= 0 ||
        row.rate <= 0
    )
  ) {
    alert("Please fill all item details.");
    return;
  }

if (grandTotal <= 0) {
  alert("Total Amount must be greater than 0");
  return;
}
    const res = await fetch( "/api/sales", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          customerId,
          totalAmount:invoiceTotal,
          rows,
        }),
      }
    );

    const data = await res.json();
     if (data.error) {
      alert(data.error);
      return;
    }
    setCustomerId("");
    setRows([
  {
    stockItemId: "",
    qty: 1,
    rate: 0,
    gst:0,
  },
    ]);
   loadVouchers();
  }

  async function loadCustomers() {
  const res = await fetch("/api/customers/list");
  const data = await res.json();
  setCustomers(data);
}

  useEffect(() => {
    loadVouchers();
    loadItems();
    loadCustomers();
  }, []);
  
  const grandTotal = rows.reduce( (sum, row) =>
    sum + Number(row.qty) * Number(row.rate),
  0
); 
  const taxableAmount = rows.reduce(
  (sum, row) =>
    sum + Number(row.qty) * Number(row.rate),
  0
);

const gstAmount = rows.reduce(
  (sum, row) =>
    sum +(Number(row.qty) * Number(row.rate) * Number(row.gst)) /100, 0
);

const invoiceTotal =taxableAmount + gstAmount;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Sales Voucher
      </h1>

      <div className="mt-6">
  <select
  className="border p-2 mb-4 w-full"
  value={customerId}
  onChange={(e) =>
    setCustomerId(e.target.value)
  }
>
  <option value="">
    Select Customer
  </option>

  {customers.map((customer: any) => (
    <option
      key={customer.id}
      value={customer.id}
    >
      {customer.name}
    </option>
  ))}
</select>

  <table className="w-full border">
    <thead>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Rate</th>
        <th>Amount</th>
        <th>GST %</th>
      </tr>
    </thead>

    <tbody>
      {rows.map((row, index) => (
        <tr key={index}>
          <td>
            <select
  className="border p-1 w-full"
  value={row.stockItemId || ""}
  onChange={(e) => {
  const selected = items.find(
    (item: any) => item.id === e.target.value
  );

  const updated = [...rows];
    updated[index] = {
    ...updated[index],
    stockItemId: e.target.value,
    gst: Number(selected?.gstPercent ?? 0),
  };

  setRows(updated);
}}
>
  <option value="">
    Select Item
  </option>

  {items.map((item: any) => (
    <option
      key={item.id}
      value={item.id}
    >
      {item.name}
    </option>
  ))}
</select>
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
            {(Number(row.qty)*Number(row.rate)*(1+Number(row.gst)/100)).toFixed(2)}
          </td>
          <td>{row.gst}%</td>
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

 <div className="mt-6 border rounded p-4 w-80 ml-auto">
  <div className="flex justify-between">
    <span>Taxable</span>
    <span>₹{taxableAmount.toFixed(2)}</span>
  </div>

  <div className="flex justify-between">
    <span>GST</span>
    <span>₹{gstAmount.toFixed(2)}</span>
  </div>

  <hr className="my-2" />

  <div className="flex justify-between font-bold text-lg">
    <span>Grand Total</span>
    <span>₹{invoiceTotal.toFixed(2)}</span>
  </div>
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
             className="border p-3 mb-2 cursor-pointer hover:bg-gray-100"
             onClick={() =>
             window.location.href =`/dashboard/sales/${v.id}`  }
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
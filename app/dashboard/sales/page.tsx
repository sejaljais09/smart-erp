"use client";

import { useEffect, useState } from "react";

export default function SalesPage() {
  

   const [vouchers, setVouchers] = useState([]);
   const [items, setItems] = useState([]);
   const [customers, setCustomers] = useState([]);
   const [customerId, setCustomerId] = useState("");

   const [rows, setRows] = useState([
  {
    stockItemId: "",
    qty: 1,
    rate: 0,
  },
]);

function addRow() {
  setRows([
    ...rows,
    {
      stockItemId: "",
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
          totalAmount:grandTotal,
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
      </tr>
    </thead>

    <tbody>
      {rows.map((row, index) => (
        <tr key={index}>
          <td>
            <select
  className="border p-1 w-full"
  value={row.stockItemId || ""}
  onChange={(e) =>
    updateRow(
      index,
      "stockItemId",
      e.target.value
    )
  }
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
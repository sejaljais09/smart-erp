"use client";

import { useEffect, useState } from "react";

export default function PurchasePage() {
 const [partyName, setPartyName] =useState("");
 const [vouchers, setVouchers] =useState([]);
 const [items, setItems] = useState([]);
 const [stockItemId, setStockItemId] =useState("");
 const [qty, setQty] = useState("");
 const [rate, setRate] = useState("");
  async function loadVouchers() {
    const res = await fetch(
      "/api/purchase/list"
    );

    const data = await res.json();

    setVouchers(data);
  }

  async function loadItems() {
  const res = await fetch(
    "/api/inventory/list"
  );

  const data = await res.json();

  setItems(data);
}

  async function createVoucher() {
    const res = await fetch(
      "/api/purchase",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
       body: JSON.stringify({
          partyName,
          stockItemId,
          qty: Number(qty),
          rate: Number(rate),
          totalAmount,
     }),
      }
    );

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setPartyName("");
    setStockItemId("");
    setQty("");
    setRate("");

    loadVouchers();
  }

  useEffect(() => {
  loadVouchers();
  loadItems();
}, []);
const totalAmount =
  Number(qty) * Number(rate);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Purchase Voucher
      </h1>

      <div className="flex gap-3 mt-6">
        <input
          placeholder="Supplier Name"
          className="border p-2"
          value={partyName}
          onChange={(e) =>
            setPartyName(
              e.target.value
            )
          }
        />

      <select
  className="border p-2"
  value={stockItemId}
  onChange={(e) =>
    setStockItemId(e.target.value)
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

<input
  type="number"
  placeholder="Qty"
  className="border p-2"
  value={qty}
  onChange={(e) =>
    setQty(e.target.value)
  }
/>

<input
  type="number"
  placeholder="Rate"
  className="border p-2"
  value={rate}
  onChange={(e) =>
    setRate(e.target.value)
  }
/>

<div className="border p-2">
  ₹ {totalAmount}
</div>

        <button
          onClick={createVoucher}
          className="bg-black text-white px-4"
        >
          Save
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
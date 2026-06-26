"use client";

import { useEffect, useState } from "react";

export default function InventoryPage() {
  const [items, setItems] = useState([]);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [unit, setUnit] = useState("Nos");

  const [gstPercent, setGstPercent] =
    useState("");

  const [openingQty, setOpeningQty] =
    useState("");

  const [openingRate, setOpeningRate] =
    useState("");

  async function loadItems() {
    const res = await fetch(
      "/api/inventory/list"
    );

    const data = await res.json();

    setItems(data);
  }

  async function createItem() {
    const res = await fetch(
      "/api/inventory",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name,
          sku,
          unit,
          gstPercent:
            Number(gstPercent),
          openingQty:
            Number(openingQty),
          openingRate:
            Number(openingRate),
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Item created");

    setName("");
    setSku("");

    loadItems();
  }

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Inventory Management
      </h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          className="border p-2"
          placeholder="Item Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          className="border p-2"
          placeholder="SKU"
          value={sku}
          onChange={(e) =>
            setSku(e.target.value)
          }
        />

        <select
          className="border p-2"
          value={unit}
          onChange={(e) =>
            setUnit(e.target.value)
          }
        > 
          <option>unit</option>
          <option>Nos</option>
          <option>Kg</option>
          <option>Box</option>
        </select>

        <input
          type="number"
          className="border p-2"
          placeholder="GST %"
          value={gstPercent}
          onChange={(e) =>
            setGstPercent(
              e.target.value
            )
          }
        />

        <input
          type="number"
          className="border p-2"
          placeholder="Opening Qty"
          value={openingQty}
          onChange={(e) =>
            setOpeningQty(
              e.target.value
            )
          }
        />

        <input
          type="number"
          className="border p-2"
          placeholder="Opening Rate"
          value={openingRate}
          onChange={(e) =>
            setOpeningRate(
              e.target.value
            )
          }
        />

        <button
          onClick={createItem}
          className="bg-black text-white px-4"
        >
          Create
        </button>
      </div>

      <div className="mt-10">
        {items.map((item: any) => (
          <div
            key={item.id}
            className="border p-3 mb-2"
          >
            <h2 className="font-semibold">
              {item.name}
            </h2>

            <p>
              Unit: {item.unit}
            </p>

            <p>
              SKU: {item.sku}
            </p>

            <p>
              GST: {item.gstPercent}%
            </p>

            <p>
              Stock: {item.openingQty}
            </p>

            <p>
              Opening Rate: {item.openingRate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
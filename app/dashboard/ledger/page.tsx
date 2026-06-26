"use client";

import { useEffect, useState } from "react";

export default function LedgerPage() {
  const [name, setName] = useState("");
  const [groupName, setGroupName] =
    useState("Assets");
  const [openingBal, setOpeningBal] =
    useState("0");

  const [ledgers, setLedgers] =
    useState([]);

  async function loadLedgers() {
    const res = await fetch(
      "/api/ledger/list"
    );

    const data = await res.json();

    setLedgers(data);
  }

  async function createLedger() {
  if (!name.trim()) {
    alert("Ledger name required");
    return;
  }

  const res = await fetch(
    "/api/ledger",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        name,
        groupName,
        openingBal:
          Number(openingBal),
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  alert("Ledger created");

  setName("");
  setOpeningBal("0");

  loadLedgers();
}

  useEffect(() => {
    loadLedgers();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Ledger Management
      </h1>

      <div className="flex gap-3 mb-8">
        <input
          className="border p-2"
          placeholder="Ledger Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <select
          className="border p-2"
          value={groupName}
          onChange={(e) =>
            setGroupName(
              e.target.value
            )
          }
        >
          <option>Assets</option>
          <option>Liabilities</option>
          <option>Income</option>
          <option>Expenses</option>
          <option>Customers</option>
          <option>Suppliers</option>
          <option>Bank Accounts</option>
          <option>Cash-in-Hand</option>
        </select>

        <input
          type="number"
          className="border p-2"
          placeholder="Opening Balance"
          value={openingBal}
          onChange={(e) =>
            setOpeningBal(
              e.target.value
            )
          }
        />

        <button
          onClick={createLedger}
          className="bg-black text-white px-4"
        >
          Create
        </button>
      </div>

      <div>
        {ledgers.map((l: any) => (
          <div
            key={l.id}
            className="border p-3 mb-2"
          >
            <h2 className="font-semibold">
              {l.name}
            </h2>

            <p>
              Group: {l.groupName}
            </p>

            <p>
              Opening Balance: ₹
              {l.openingBal}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gstin, setGstin] = useState("");
  const [address, setAddress] = useState("");
  const [openingBalance, setOpeningBalance] =
    useState("");

  async function loadSuppliers() {
    const res = await fetch(
      "/api/suppliers/list"
    );

    const data = await res.json();

    setSuppliers(data);
  }

  async function createSupplier() {
    const res = await fetch(
      "/api/suppliers",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          gstin,
          address,
          openingBalance:
            Number(openingBalance),
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Supplier created");

    setName("");
    setPhone("");
    setEmail("");
    setGstin("");
    setAddress("");
    setOpeningBalance("");

    loadSuppliers();
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Supplier Management
      </h1>

      <div className="mt-6 flex flex-wrap gap-3">

        <input
          className="border p-2"
          placeholder="Supplier Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          className="border p-2"
          placeholder="Phone"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />

        <input
          className="border p-2"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="border p-2"
          placeholder="GSTIN"
          value={gstin}
          onChange={(e) =>
            setGstin(e.target.value)
          }
        />

        <input
          className="border p-2"
          placeholder="Address"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
        />

        <input
          type="number"
          className="border p-2"
          placeholder="Opening Balance"
          value={openingBalance}
          onChange={(e) =>
            setOpeningBalance(
              e.target.value
            )
          }
        />

        <button
          onClick={createSupplier}
          className="bg-black text-white px-4"
        >
          Create
        </button>
      </div>

      <div className="mt-10">
        {suppliers.map((supplier: any) => (
          <div
            key={supplier.id}
            className="border p-3 mb-2"
          >
            <h2 className="font-bold">
              {supplier.name}
            </h2>

            <p>
              Phone: {supplier.phone}
            </p>

            <p>
              Email: {supplier.email}
            </p>

            <p>
              GSTIN: {supplier.gstin}
            </p>

            <p>
              Address: {supplier.address}
            </p>

            <p>
              Opening Balance: ₹
              {supplier.openingBalance}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
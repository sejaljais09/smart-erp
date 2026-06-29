"use client";

import { useEffect, useState } from "react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gstin, setGstin] = useState("");
  const [address, setAddress] = useState("");
  const [openingBalance, setOpeningBalance] =
    useState("");

  async function loadCustomers() {
    const res = await fetch(
      "/api/customers/list"
    );

    const data = await res.json();

    setCustomers(data);
  }

  async function createCustomer() {
    const res = await fetch(
      "/api/customers",
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

    alert("Customer created");

    setName("");
    setPhone("");
    setEmail("");
    setGstin("");
    setAddress("");
    setOpeningBalance("");

    loadCustomers();
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Customer Management
      </h1>

      <div className="mt-6 flex flex-wrap gap-3">

        <input
          className="border p-2"
          placeholder="Customer Name"
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
          onClick={createCustomer}
          className="bg-black text-white px-4"
        >
          Create
        </button>
      </div>

      <div className="mt-10">
        {customers.map((customer: any) => (
          <div
            key={customer.id}
            className="border p-3 mb-2"
          >
            <h2 className="font-bold">
              {customer.name}
            </h2>

            <p>
              Phone: {customer.phone}
            </p>

            <p>
              Email: {customer.email}
            </p>

            <p>
              GSTIN: {customer.gstin}
            </p>

            <p>
              Address: {customer.address}
            </p>

            <p>
              Opening Balance: ₹
              {customer.openingBalance}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

export default function CompanyPage() {
  const [name, setName] = useState("");
  const [gstin, setGstin] = useState("");
  const [companies, setCompanies] = useState([]);

  async function loadCompanies() {
    const res = await fetch(
      "/api/company/list"
    );

    const data = await res.json();

    setCompanies(data);
  }

  async function createCompany() {
    if (!name.trim()) {
  alert("Company name is required");
  return;
}
    await fetch("/api/company", {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        name,
        gstin,
      }),
    });

    setName("");
    setGstin("");

    loadCompanies();
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Companies
      </h1>

      <div className="mt-6 flex gap-3">
        <input
          placeholder="Company Name"
          className="border p-2"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          placeholder="GSTIN"
          className="border p-2"
          value={gstin}
          onChange={(e) =>
            setGstin(e.target.value)
          }
        />

        <button
          onClick={createCompany}
          className="bg-black text-white px-4"
        >
          Create
        </button>
      </div>

      <div className="mt-10">
  {companies.map((c: any) => (
    <div
      key={c.id}
      className="border p-3 mb-2 flex items-center justify-between"
    >
      <div>
        <h2 className="font-semibold">
          {c.name}
        </h2>

        <p className="text-sm text-gray-600">
          {c.gstin}
        </p>
      </div>

      <button
        onClick={async () => {
          await fetch(
            "/api/company/select",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                companyId: c.id,
              }),
            }
          );

          alert(
            `${c.name} selected`
          );
        }}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Select
      </button>
    </div>
  ))}
</div>
    </div>
  );
}
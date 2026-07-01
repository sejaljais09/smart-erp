"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const q = query.toLowerCase();

    if (q.includes("customer"))
      router.push("/dashboard/customers");

    else if (q.includes("supplier"))
      router.push("/dashboard/suppliers");

    else if (q.includes("sales"))
      router.push("/dashboard/sales");

    else if (q.includes("purchase"))
      router.push("/dashboard/purchase");

    else if (q.includes("inventory"))
      router.push("/dashboard/inventory");

    else if (q.includes("ledger"))
      router.push("/dashboard/ledger");

    else if (q.includes("company"))
      router.push("/dashboard/company");

    else
      alert("No matching page found");
  };

  return (
    <div className="flex gap-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search module..."
         className="w-72 rounded-lg border border-gray-300 px-4 py-2  text-black placeholder:text-gray-500  bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />

      <button
        onClick={handleSearch}
        className="rounded-lg bg-blue-600 px-4 text-white hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}
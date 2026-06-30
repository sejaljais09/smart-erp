"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  ShoppingCart,
  Users,
  Truck,
  Package,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";



export default function DashboardPage() {
  const [data, setData] = useState({
    totalSales: 0,
    totalPurchase: 0,
    customers: 0,
    suppliers: 0,
    items: 0,
  });

  const [overview, setOverview] = useState({
  recentSales: [],
  recentPurchases: [],
  lowStock: [],
});
const [monthlySales, setMonthlySales] = useState([]);
const [topProducts, setTopProducts] = useState([]);


  async function loadDashboard() {
    const res = await fetch("/api/dashboard");
    const result = await res.json();
    setData(result);
  }

  async function loadOverview() {
  const res = await fetch(
    "/api/dashboard/overview"
  );

  const data = await res.json();

  setOverview(data);
}

async function loadMonthlySales() {
  const res = await fetch(
    "/api/dashboard/monthly-sales"
  );

  const data = await res.json();

  setMonthlySales(data);
}

async function loadTopProducts() {
  const res = await fetch(
    "/api/dashboard/top-products"
  );

  const data = await res.json();

  setTopProducts(data);
}


  useEffect(() => {
 loadDashboard();
  loadOverview();
  loadMonthlySales();
  loadTopProducts();
 
}, []);

  const cards = [
    {
      title: "Total Sales",
      value: `₹${Number(data.totalSales).toLocaleString("en-IN")}`,
      subtitle: "All time sales",
      bg: "bg-green-500",
      icon: ShoppingBag,
    },
    {
      title: "Total Purchase",
      value: `₹${Number(data.totalPurchase).toLocaleString("en-IN")}`,
      subtitle: "All time purchase",
      bg: "bg-blue-500",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      value: data.customers,
      subtitle: "Total customers",
      bg: "bg-purple-500",
      icon: Users,
    },
    {
      title: "Suppliers",
      value: data.suppliers,
      subtitle: "Total suppliers",
      bg: "bg-orange-500",
      icon: Truck,
    },
    {
      title: "Items",
      value: data.items,
      subtitle: "Total items",
      bg: "bg-pink-500",
      icon: Package,
    },
  ];



  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-bold text-black">
        Dashboard
      </h1>

      <p className="text-black mt-2 text-lg">
        Welcome back! Here's what's happening with your business.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mt-10">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl shadow-md border p-8 hover:shadow-xl transition"
            >
              <div
                className={`w-24 h-24 rounded-2xl ${card.bg} flex items-center justify-center`}
              >
                <Icon
                  size={48}
                  color="white"
                  strokeWidth={2}
                />
              </div>

              <h2 className="mt-8 text-2xl font-semibold text-black">
                {card.title}
              </h2>

              <p className="mt-4 text-5xl font-bold text-black">
                {card.value}
              </p>

              <p className="mt-5 text-black text-xl">
                {card.subtitle}
              </p>
            </div>
          );
        })}
      </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-10">

  {/* Recent Sales */}

  <div className="bg-white rounded-2xl shadow p-6">

    <h2 className="text-xl font-bold mb-4 text-black">
      Recent Sales
    </h2>

    {overview.recentSales.length === 0 ? (
      <p className="text-red-500">No sales yet.</p>
    ) : (
      overview.recentSales.map((sale: any) => (
        <div
  key={sale.id}
  onClick={() =>
    window.location.href =
      `/dashboard/sales/${sale.id}`
  }
  className="flex justify-between border-b py-3 cursor-pointer hover:bg-gray-100 rounded-lg px-2 transition"
>
          <span className="text-black font-medium">
              #{sale.voucherNo}</span>
            <span className="text-sm text-gray-600">
    {sale.partyName}
  </span>   
          <span className="text-xs text-gray-500">
    {sale.items
      .map((i: any) => i.stockItem.name)
      .join(", ")}
  </span>
   
         <span className="text-black font-semibold">
  ₹{sale.totalAmount}
        </span>
       </div>
      ))
    )}
  </div>

  {/* Recent Purchases */}

  <div className="bg-white rounded-2xl shadow p-6">

    <h2 className="text-xl font-bold mb-4 text-black">
      Recent Purchases
    </h2>

    {overview.recentPurchases.length === 0 ? (
      <p className="text-red-500">No purchases yet.</p>
    ) : (
      overview.recentPurchases.map((purchase: any) => (
        <div
  key={purchase.id}
  onClick={() =>
    window.location.href =
      `/dashboard/purchase/${purchase.id}`
  }
  className="flex justify-between border-b py-3 cursor-pointer hover:bg-gray-100 rounded-lg px-2 transition"
>
          <span className="text-black font-medium">
            #{purchase.voucherNo}
          </span>
          <span className="text-sm text-gray-600">
    {purchase.partyName}
          </span>
           <span className="text-xs text-gray-500">
    {purchase.items
      .map((i: any) => i.stockItem.name)
      .join(", ")}
  </span>

          <span className="text-black font-semibold">
            ₹{purchase.totalAmount}
          </span>
        </div>
      ))
    )}
  </div>

  {/* Low Stock */}

  <div className="bg-white rounded-2xl shadow p-6">

    <h2 className="text-xl font-bold text-red-600 mb-4">
      Low Stock
    </h2>

    {overview.lowStock.length === 0 ? (
      <p>No low stock items 🎉</p>
    ) : (
      overview.lowStock.map((item: any) => (
        <div
          key={item.id}
          className="flex justify-between border-b py-3"
        >
          <span className="text-black font-medium">
            {item.name}
          </span>

          <span className="font-bold text-red-600">
            {item.currentQty}
          </span>
        </div>
      ))
    )}
  </div>

  <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

  <h2 className="text-2xl font-bold mb-5">
    🔥 Top Selling Products
  </h2>

  {topProducts.length === 0 ? (
    <p className="text-gray-500">
      No sales yet.
    </p>
  ) : (
    topProducts.map((product: any, index) => (
      <div
        key={index}
        className="flex justify-between items-center border-b py-3 last:border-none"
      >
        <div>
          <p className="font-semibold text-black">
            {product.name}
          </p>

          <p className="text-sm text-gray-500">
            Rank #{index + 1}
          </p>
        </div>

        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
          {product.qty} pcs
        </span>
      </div>
    ))
  )}

</div>

</div>

     
     <div className="bg-white rounded-2xl shadow-md p-6 mt-10">

  <h2 className="text-2xl font-bold mb-6">
    Monthly Sales
  </h2>

  <ResponsiveContainer
    width="100%"
    height={320}
  >
    <LineChart data={monthlySales}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="month" tick={{fill:"#000"}} />

      <YAxis  tick={{fill:"#000"}}/>

      <Tooltip
        contentStyle={{
       color: "#000",
      }}
/>

      <Line
        type="monotone"
        dataKey="total"
        stroke="#22c55e"
        strokeWidth={3}
      />
    </LineChart>
  </ResponsiveContainer>

</div>
    </div>
  );
}
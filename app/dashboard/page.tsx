import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

   return (
    <div className="p-10">
      <DashboardClient />
      <h1 className="text-4xl font-bold">
        SmartERP
      </h1>

      <p className="mt-2">
        Welcome {session.user?.name}
      </p>

      <div className="mt-10 space-y-3 border p-6 rounded">
        <p>F2 → Companies</p>
        <p>F4 → Ledgers</p>
        <p>F6 → Inventory</p>
        <p>F8 → Sales Voucher</p>
        <p>F9 → Purchase Voucher</p>
      </div>
    </div>
  );
}
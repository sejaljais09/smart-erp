import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import DashboardClient from "./DashboardClient";
import UserMenu from "./UserMenu";
import DashboardSearch from "./DashboardSearch";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session=await auth();
  if(!session){
    redirect("/login");
  }
  return (
    <>
      <DashboardClient />
      
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-8 py-4 shadow-sm">

  {/* Logo */}
  <div>
    <h1 className="text-2xl font-bold text-blue-600">
      Smart ERP
    </h1>
    <p className="text-xs text-gray-500">
      Business Management System
    </p>
  </div>

  {/* Right Side */}
  <div className="flex items-center gap-5">

    {/* Search */}
    <DashboardSearch />


    {/* Notification */}
    <button className="relative rounded-lg p-2 hover:bg-gray-100">
      🔔

      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
        3
      </span>
    </button>

    <UserMenu
      name={session.user?.name ?? ""}
      email={session.user?.email ?? ""}
    />
  </div>

</header>

      <main>{children}</main>
    </>
  );
}
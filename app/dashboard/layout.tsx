import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import DashboardClient from "./DashboardClient";
import UserMenu from "./UserMenu";

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
        <h1 className="text-2xl font-bold text-blue-600">
          Smart ERP
        </h1>

        <UserMenu
          name={session.user?.name ?? ""}
          email={session.user?.email ?? ""}
        />
      </header>

      <main>{children}</main>
    </>
  );
}
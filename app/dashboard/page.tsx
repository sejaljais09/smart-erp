import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        SmartERP Dashboard
      </h1>

      <p>
        Welcome {session.user?.name}
      </p>
    </div>
  );
}
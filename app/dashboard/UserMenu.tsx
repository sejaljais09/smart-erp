"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { UserCircle2, LogOut, ChevronDown } from "lucide-react";

export default function UserMenu({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
     <button
  onClick={() => setOpen(!open)}
  className="flex items-center gap-3 rounded-xl border bg-white px-3 py-2 shadow hover:bg-gray-100 transition"
>
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
    {name.charAt(0).toUpperCase()}
  </div>

  <div className="text-left">
    <p className="font-semibold text-black">
      {name}
    </p>

    <p className="text-xs text-gray-500">
      Administrator
    </p>
  </div>

  <ChevronDown size={18} />
</button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border bg-white shadow-xl z-50">
          <div className="border-b p-4">
            <p className="font-bold text-black">
              {name}
            </p>

            <p className="text-sm text-gray-500">
              {email}
            </p>
          </div>

          <button
            onClick={() =>
              signOut({
                callbackUrl: "/login",
              })
            }
            className="flex w-full items-center gap-2 p-4 text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
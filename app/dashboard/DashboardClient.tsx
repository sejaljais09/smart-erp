"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardClient() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "F2") {
        e.preventDefault();
        router.push("/dashboard/company");
      }

      if (e.key === "F4") {
        e.preventDefault();
        router.push("/dashboard/ledger");
      }

      if (e.key === "F6") {
        e.preventDefault();
        router.push("/dashboard/inventory");
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [router]);

  return null;
}
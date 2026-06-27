"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardClient() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "F1") {
        e.preventDefault();
        console.log("F1 pressed");
        router.push("/dashboard/company");
      }

      if (e.altKey && e.key.toLowerCase()=== "l") {
        e.preventDefault();
        console.log("Alt+L pressed");
        router.push("/dashboard/ledger");
      }
      
      if (e.key === "F8") {
        e.preventDefault();
        console.log("F8 pressed");
        router.push("/dashboard/sales");
      }
       if (e.key === "F9") {
        e.preventDefault();
        console.log("F9 pressed");
        router.push("/dashboard/purchase");
      }
       if (e.ctrlKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        console.log("Ctrl+H pressed");
        router.push("/dashboard");
      }

      if (e.ctrlKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        console.log("Ctrl+I pressed");
        router.push("/dashboard/inventory");
      }
       if (e.key === "Escape") {
        e.preventDefault();
        console.log("Escape pressed");
        router.back();
      }
      if (e.key === "F8") {
  e.preventDefault();
  router.push("/dashboard/sales");
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
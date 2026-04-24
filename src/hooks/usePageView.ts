"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function usePageView() {
  const pathname = usePathname();
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {});
  }, [pathname]);
}

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function usePageView() {
  const pathname = usePathname();
  const fired = useRef(false);
  const pageViewId = useRef<number | null>(null);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    startTime.current = Date.now();

    const referrer = document.referrer || undefined;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { id: number } | null) => {
        if (data?.id) pageViewId.current = data.id;
      })
      .catch(() => {});
  }, [pathname]);

  // Send duration on page leave
  useEffect(() => {
    function sendDuration() {
      const id = pageViewId.current;
      if (!id) return;
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      if (duration < 1) return;
      // Use sendBeacon for reliability during page unload
      const payload = JSON.stringify({ id, duration });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track/duration", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/track/duration", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") sendDuration();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", sendDuration);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", sendDuration);
    };
  }, []);
}

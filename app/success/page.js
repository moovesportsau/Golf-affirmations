"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("paid", "true");
    setTimeout(() => router.push("/"), 1200);
  }, [router]);

  return (
    <main style={{ padding: 20, fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>Payment Successful 🎉</h1>
      <p>Full access unlocked.</p>
      <p>Redirecting…</p>
    </main>
  );
}

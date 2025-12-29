import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("paid", "true");
    setTimeout(() => router.push("/"), 1500);
  }, [router]);

  return (
    <main style={{ padding: 20, fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>Payment Successful 🎉</h1>
      <p>Full access unlocked.</p>
      <p>Redirecting…</p>
    </main>
  );
}

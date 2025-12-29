import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { affirmations } from "../data/affirmations";

export default function Home() {
  const router = useRouter();
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    setPaid(localStorage.getItem("paid") === "true");
  }, []);

  const lockedCategories = [
    "Tournament Mindset",
    "Recovery",
    "Pre-Round",
    "Course Management",
    "Technique",
    "Growth",
    "Resilience",
  ];

  const handleCategoryClick = (category) => {
    if (lockedCategories.includes(category) && !paid) {
      alert("Unlock full access to view this category.");
      return;
    }

    router.push(`/category/${category}`);
  };

  const handleCheckout = async () => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <main style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Golf Affirmations</h1>

      {!paid && (
        <button
          onClick={handleCheckout}
          style={{
            padding: 14,
            marginBottom: 20,
            width: "100%",
            fontSize: 16,
            borderRadius: 10,
            background: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          🔓 Unlock Full Access – $2.49
        </button>
      )}

      {Object.keys(affirmations).map((category) => (
        <div
          key={category}
          onClick={() => handleCategoryClick(category)}
          style={{
            padding: 16,
            marginBottom: 12,
            borderRadius: 12,
            background: "#f5f5f5",
            fontSize: 18,
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{category}</span>
          {lockedCategories.includes(category) && !paid && <span>🔒</span>}
        </div>
      ))}
    </main>
  );
}

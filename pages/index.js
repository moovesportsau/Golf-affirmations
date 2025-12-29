import { useRouter } from "next/router";
import { affirmations } from "../data/affirmations";

export default function Home() {
  const router = useRouter();

  // Optional: keep these shown with a lock icon to signal future premium
  const lockedCategories = [
    "Tournament Mindset",
    "Recovery",
    "Pre-Round",
    "Course Management",
    "Technique",
    "Growth",
    "Resilience",
  ];

  return (
    <main style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Golf Affirmations</h1>
      <p>Mental strength training for competitive and junior golfers.</p>

      <button
        onClick={() => alert("Premium unlock is coming soon!")}
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
        🔓 Unlock Full Access (Coming Soon)
      </button>

      {Object.keys(affirmations).map((category) => (
        <div
          key={category}
          onClick={() => router.push(`/category/${category}`)}
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
          {lockedCategories.includes(category) && <span>🔒</span>}
        </div>
      ))}
    </main>
  );
}



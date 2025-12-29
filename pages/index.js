import { useRouter } from "next/router";
import { affirmations } from "../data/affirmations";

export default function Home() {
  const router = useRouter();

  // These are the ONLY free sections for now:
  const FREE_KEYS = new Set(["Confidence", "Focus"]);

  // Helper to display nicer titles from keys
  const pretty = (key) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase())
      .trim();

  const goToCategory = (slug, isLocked) => {
    if (isLocked) {
      alert("This category is locked for now. Premium unlock coming soon!");
      return;
    }
    router.push(`/category/${slug}`);
  };

  // Categories that exist in your affirmations data file
  const categoryKeys = Object.keys(affirmations);

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

      {/* Free categories from data */}
      {categoryKeys.map((key) => {
        const isLocked = !FREE_KEYS.has(key);
        return (
          <div
            key={key}
            onClick={() => goToCategory(key, isLocked)}
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
            <span>{pretty(key)}</span>
            {isLocked && <span>🔒</span>}
          </div>
        );
      })}

      {/* Coach Notes ALWAYS exists (even though it's user-entered) */}
      <div
        onClick={() => goToCategory("coachNotes", false)}
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
        <span>Coach Notes</span>
        <span>✅</span>
      </div>
    </main>
  );
}


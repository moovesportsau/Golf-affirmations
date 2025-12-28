import { useRouter } from "next/router";
import { affirmations } from "../../data/affirmations";

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug) return null;

  const items = affirmations[slug];

  // COACH NOTES PAGE
  if (!items) {
    return (
      <main style={{ padding: 20, fontFamily: "sans-serif" }}>
        <h1>Coach Notes</h1>

        <textarea
          placeholder="Add your own notes here..."
          style={{
            width: "100%",
            minHeight: 200,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            marginBottom: 12,
            fontSize: 16
          }}
          onChange={(e) =>
            localStorage.setItem("coachNotes", e.target.value)
          }
          defaultValue={
            typeof window !== "undefined"
              ? localStorage.getItem("coachNotes")
              : ""
          }
        />

        <p style={{ fontSize: 12, color: "#666" }}>
          Notes are saved on this device.
        </p>

        <button onClick={() => router.push("/")}>← Back</button>
      </main>
    );
  }

  // AFFIRMATION CATEGORY PAGE
  return (
    <main style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>{slug.replace(/([A-Z])/g, " $1")}</h1>

      {items.map((text, index) => (
        <div
          key={index}
          style={{
            padding: 16,
            marginBottom: 16,
            borderRadius: 12,
            background: "#f5f5f5",
            fontSize: 16,
            lineHeight: 1.5
          }}
        >
          {text}
        </div>
      ))}

      <button onClick={() => router.push("/")}>← Back</button>
    </main>
  );
}

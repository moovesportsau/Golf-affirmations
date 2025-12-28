import { useRouter } from "next/router";
import { affirmations } from "../../data/affirmations";

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug) return null;

  const items = affirmations[slug];

  if (!items) {
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

  return (
    <main style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>{slug.replace(/([A-Z])/g, " $1")}</h1>

      {items.map((text, index) => (
        <p key={index} style={{ marginBottom: 16 }}>
          {text}
        </p>
      ))}

      <button onClick={() => router.push("/")}>← Back</button>
    </main>
  );
}

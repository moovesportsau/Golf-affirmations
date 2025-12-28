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
        <h1>Coach Notes</h1>
        <p>You’ll be able to add your own notes here.</p>
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

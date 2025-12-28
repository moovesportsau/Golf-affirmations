import Link from "next/link";
import { affirmations } from "../data/affirmations";

export default function Home() {
  return (
    <main style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Golf Affirmations</h1>
      <p>Mental strength training for competitive golfers.</p>

      <h2>Categories</h2>
      <ul>
        {Object.keys(affirmations).map((category) => (
          <li key={category} style={{ marginBottom: 8 }}>
            <Link href={`/category/${category}`}>
              {category.replace(/([A-Z])/g, " $1")}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/category/coachNotes">Coach Notes</Link>
        </li>
      </ul>

      <button>Unlock Full Access</button>
    </main>
  );
}

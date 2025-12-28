import { affirmations } from "../data/affirmations";

export default function Home() {
  return (
    <main style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Golf Affirmations</h1>
      <p>Mental strength training for competitive golfers.</p>

      <h2>Categories</h2>
      <ul>
        {Object.keys(affirmations).map((category) => (
          <li key={category}>
            {category.replace(/([A-Z])/g, " $1")}
          </li>
        ))}
        <li>Coach Notes</li>
      </ul>

      <button>Unlock Full Access</button>
    </main>
  );
}

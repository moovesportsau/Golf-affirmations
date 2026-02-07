import Head from "next/head";
import Link from "next/link";

export default function OnCourseCaddieHub() {

const items = [
  {
    title: "Pre-Round",
    href: "/category/pre-round",
    desc: "Settle your mind. Commit to how you want to play today.",
  },
  {
    title: "Tee Shot",
    href: "/category/tee-shot",
    desc: "Pick a line. Commit to it. Swing free.",
  },
  {
    title: "Approach",
    href: "/category/approach",
    desc: "Smart target. Smooth strike. Middle of the green is good.",
  },
  {
    title: "Putting",
    href: "/category/putting",
    desc: "Read it. Trust it. Roll it with great pace.",
  },
  {
    title: "Comeback",
    href: "/category/comeback",
    desc: "That shot’s over. Let’s focus on the next one.",
  },
  {
    title: "Pressure",
    href: "/category/pressure",
    desc: "Slow breath. Same routine. You’re ready for this.",
  },
];

  return (
    <>
      <Head>
        <title>On-Course Caddie</title>
      </Head>

      <main style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 6 }}>On-Course Caddie</h1>
        <p style={{ marginTop: 0, opacity: 0.9 }}>
          I’ve got you. Pick the shot you’re facing.
        </p>

        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              style={{
                display: "block",
                padding: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{it.title}</div>
              <div style={{ opacity: 0.85, fontSize: 14 }}>{it.desc}</div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <Link href="/" style={{ opacity: 0.85 }}>
            ← Back to Categories
          </Link>
        </div>
      </main>
    </>
  );
}

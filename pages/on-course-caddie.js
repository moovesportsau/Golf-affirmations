import Head from "next/head";
import Link from "next/link";

export default function OnCourseCaddieHub() {
  const items = [
    { title: "Pre-Round", href: "/category/pre-round", desc: "Get your mind calm, clear, and committed before the first tee." },
    { title: "Tee Shot", href: "/category/tee-shot", desc: "Commit to a target and swing with freedom off the tee." },
    { title: "Approach", href: "/category/approach", desc: "Pick smart targets and trust your strike into greens." },
    { title: "Putting", href: "/category/putting", desc: "Read it, trust it, and roll it with great pace." },
    { title: "Comeback", href: "/category/comeback", desc: "Reset fast after a mistake and get back to your process." },
    { title: "Pressure", href: "/category/pressure", desc: "Stay calm and committed when it matters most." },
  ];

  return (
    <>
      <Head>
        <title>On-Course Caddie</title>
      </Head>

      <main style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 8 }}>On-Course Caddie</h1>
        <p style={{ marginTop: 0, opacity: 0.85 }}>
          Pick the moment you’re in — then swipe through caddie-style prompts built for the course.
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

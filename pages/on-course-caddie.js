import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";


const styles = {
  page: {
    minHeight: "100vh",
    backgroundImage: 'url("/golf-bg.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  overlay: {
    minHeight: "100vh",
    paddingTop: "max(14px, env(safe-area-inset-top))",
    paddingBottom: "max(24px, env(safe-area-inset-bottom))",
    paddingLeft: 12,
    paddingRight: 12,
    background: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.35))",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    width: "100%",
    maxWidth: 560,
    boxSizing: "border-box",
    margin: "0 auto",
    borderRadius: 18,
    padding: 14,
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    color: "white",
  },
  h1: {
    fontSize: 34,
    fontWeight: 900,
    margin: "8px 0 6px",
    letterSpacing: -0.5,
    lineHeight: 1.05,
  },
  p: {
    fontSize: 14,
    opacity: 0.9,
    margin: "0 0 14px",
    lineHeight: 1.35,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 10,
  },
  tile: {
    borderRadius: 16,
    padding: 14,
    background: "rgba(0,0,0,0.28)",
    border: "1px solid rgba(255,255,255,0.2)",
    cursor: "pointer",
  },
  tileTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  tileTitle: {
    fontSize: 18,
    fontWeight: 900,
    margin: 0,
  },
  tileDesc: {
    margin: 0,
    opacity: 0.9,
    lineHeight: 1.35,
    fontSize: 13,
  },
};

export default function OnCourseCaddieHub() {

const router = useRouter();

const items = [
  {
    title: "Pre-Round",
    href: "/category/Pre-Round?from=on-course",
    desc: "Settle your mind. Commit to how you want to play today.",
  },
  {
    title: "Tee Shot",
    href: "/category/Tee-Shot?from=on-course",
    desc: "Pick a line. Commit to it. Swing free.",
  },
  {
    title: "Approach",
    href: "/category/Approach?from=on-course",
    desc: "Smart target. Smooth strike. Middle of the green is good.",
  },
  {
    title: "Putting",
    href: "/category/Putting?from=on-course",
    desc: "Read it. Trust it. Roll it with great pace.",
  },
  {
    title: "Comeback",
    href: "/category/Comeback?from=on-course",
    desc: "That shot’s over. Let’s focus on the next one.",
  },
  {
    title: "Pressure",
    href: "/category/Pressure?from=on-course",
    desc: "Slow breath. Same routine. You’re ready for this.",
  },
];

  return (
    <>
      <Head>
        <title>On-Course Caddie</title>
      </Head>

<main style={styles.page}>
  <div style={styles.overlay}>
    <div style={styles.card}>
      
      <div
        onClick={() => router.push("/")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.18)",
          fontSize: 14,
          fontWeight: 800,
          cursor: "pointer",
          marginBottom: 8,
        }}
      >
        ← Home
      </div>
      
      <h1 style={styles.h1}>On-Course Caddie</h1>
      <p style={styles.p}>
        Pick the moment you’re in — calm cues for the next shot.
      </p>

      <div style={styles.grid}>
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={styles.tile}>
              <div style={styles.tileTitleRow}>
                <h2 style={styles.tileTitle}>{it.title}</h2>
              </div>
              <p style={styles.tileDesc}>{it.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
</main>
</>
);
}

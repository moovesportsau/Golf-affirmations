import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { affirmations } from "../../data/affirmations";

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;

  const FREE_KEYS = new Set(["Confidence", "Focus", "coachNotes"]);

  const TITLES = {
    Confidence: "Confidence",
    Focus: "Focus",
    Technique: "Technique",
    Growth: "Growth",
    PreRound: "Pre-Round",
    TournamentMindset: "Tournament Mindset",
    CourseManagement: "Course Management",
    Resilience: "Resilience",
    Recovery: "Recovery",
  };

  const styles = {
    page: {
      minHeight: "100vh",
      backgroundImage: 'url("/golf-bg.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    overlay: {
      minHeight: "100vh",
      paddingTop: "max(16px, env(safe-area-inset-top))",
      paddingBottom: "max(16px, env(safe-area-inset-bottom))",
      paddingLeft: "max(14px, env(safe-area-inset-left))",
      paddingRight: "max(14px, env(safe-area-inset-right))",
      background: "linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.42))",
      display: "flex",
      justifyContent: "center",
    },
    card: {
      width: "100%",
      maxWidth: 560,
      borderRadius: 18,
      padding: 16,
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.18)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      color: "white",
    },
    topRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
    },
    backBtn: {
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.25)",
      cursor: "pointer",
      background: "rgba(255,255,255,0.12)",
      color: "white",
      fontWeight: 800,
      fontSize: 14,
    },
    title: { margin: "6px 0 6px", fontSize: 20, lineHeight: 1.2 },
    sub: { margin: "0 0 12px", color: "rgba(255,255,255,0.9)", fontSize: 13, lineHeight: 1.4 },
    tile: {
      marginTop: 10,
      padding: 16,
      borderRadius: 14,
      background: "rgba(0,0,0,0.28)",
      border: "1px solid rgba(255,255,255,0.2)",
      userSelect: "none",
      WebkitUserSelect: "none",
      touchAction: "pan-y",
    },
    quote: { fontSize: 16, lineHeight: 1.6, margin: 0 },
    hint: { marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.8)" },
    row: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 },
    primaryBtn: {
      padding: "12px 14px",
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
      background: "white",
      color: "#111",
      fontWeight: 900,
      fontSize: 15,
      flex: "1 1 140px",
    },
    softBtn: {
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.22)",
      cursor: "pointer",
      background: "rgba(255,255,255,0.12)",
      color: "white",
      fontWeight: 800,
      fontSize: 14,
      flex: "1 1 120px",
    },
    textarea: {
      width: "100%",
      minHeight: 240,
      padding: 12,
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.22)",
      background: "rgba(0,0,0,0.28)",
      color: "white",
      outline: "none",
      fontSize: 14,
      lineHeight: 1.5,
    },
  };

  if (!slug) return null;

  // Coach Notes
  if (slug === "coachNotes") {
    const [notes, setNotes] = useState("");

    useEffect(() => {
      const saved = localStorage.getItem("coachNotes");
      if (saved) setNotes(saved);
    }, []);

    return (
      <div style={styles.page}>
        <div style={styles.overlay}>
          <main style={styles.card}>
            <div style={styles.topRow}>
              <button style={styles.backBtn} onClick={() => router.push("/")}>
                ← Back
              </button>
            </div>

            <h1 style={styles.title}>Coach Notes</h1>
            <p style={styles.sub}>Add notes from coaches, practice, or competitions.</p>

            <textarea
              style={styles.textarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Type your coach notes here…"
            />

            <div style={styles.row}>
              <button
                style={styles.primaryBtn}
                onClick={() => {
                  localStorage.setItem("coachNotes", notes);
                  alert("Saved ✅");
                }}
              >
                Save
              </button>
              <button
                style={styles.softBtn}
                onClick={() => {
                  if (confirm("Clear all notes?")) {
                    setNotes("");
                    localStorage.removeItem("coachNotes");
                  }
                }}
              >
                Clear
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Normal categories
  const categoryKey = String(slug);
  const title = TITLES[categoryKey] || categoryKey;
  const list = affirmations?.[categoryKey];

  // Locked
  if (!FREE_KEYS.has(categoryKey)) {
    return (
      <div style={styles.page}>
        <div style={styles.overlay}>
          <main style={styles.card}>
            <div style={styles.topRow}>
              <button style={styles.backBtn} onClick={() => router.push("/")}>
                ← Back
              </button>
            </div>
            <h1 style={styles.title}>{title}</h1>
            <p style={styles.sub}>🔒 This category is locked. Premium coming soon.</p>
            <button
              style={{ ...styles.primaryBtn, width: "100%", flex: "unset" }}
              onClick={() => alert("Premium unlock is coming soon!")}
            >
              Unlock (Coming Soon)
            </button>
          </main>
        </div>
      </div>
    );
  }

  if (!Array.isArray(list) || list.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.overlay}>
          <main style={styles.card}>
            <div style={styles.topRow}>
              <button style={styles.backBtn} onClick={() => router.push("/")}>
                ← Back
              </button>
            </div>
            <h1 style={styles.title}>Not found</h1>
            <p style={styles.sub}>This category doesn’t exist yet.</p>
          </main>
        </div>
      </div>
    );
  }

  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [categoryKey]);

  const next = () => setIndex((i) => (i + 1) % list.length);
  const prev = () => setIndex((i) => (i - 1 + list.length) % list.length);
  const randomPick = () => setIndex(Math.floor(Math.random() * list.length));

  const current = list[index];

  // Swipe
  const startX = useRef(null);
  const startY = useRef(null);
  const isSwiping = useRef(false);

  const onTouchStart = (e) => {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    isSwiping.current = true;
  };

  const onTouchMove = (e) => {
    if (!isSwiping.current) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - startX.current);
    const dy = Math.abs(t.clientY - startY.current);
    if (dy > dx + 10) isSwiping.current = false;
  };

  const onTouchEnd = (e) => {
    if (!startX.current || !isSwiping.current) return;

    const t = e.changedTouches[0];
    const dx = t.clientX - startX.current;
    const THRESHOLD = 45;

    if (dx <= -THRESHOLD) next();
    if (dx >= THRESHOLD) prev();

    startX.current = null;
    startY.current = null;
    isSwiping.current = false;
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <main style={styles.card}>
          <div style={styles.topRow}>
            <button style={styles.backBtn} onClick={() => router.push("/")}>
              ← Back
            </button>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
              {index + 1} / {list.length}
            </div>
          </div>

          <h1 style={styles.title}>{title}</h1>
          <p style={styles.sub}>Swipe left/right, or use the buttons.</p>

          <div
            style={styles.tile}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <p style={styles.quote}>“{current}”</p>
          </div>

          <div style={styles.row}>
            <button style={styles.softBtn} onClick={prev}>
              ← Prev
            </button>
            <button style={styles.primaryBtn} onClick={next}>
              Next →
            </button>
            <button style={styles.softBtn} onClick={randomPick}>
              Random
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

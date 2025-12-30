mport { useEffect, useRef, useState } from "react";
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

  // ---------- UI styles ----------
  const styles = {
    page: {
      minHeight: "100vh",
      padding: 20,
      backgroundImage: 'url("/golf-bg.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    overlay: {
      minHeight: "100vh",
      background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
      display: "flex",
      justifyContent: "center",
      padding: 20,
    },
    card: {
      width: "100%",
      maxWidth: 720,
      borderRadius: 18,
      padding: 18,
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.18)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      color: "white",
    },
    btn: {
      padding: "10px 14px",
      borderRadius: 12,
      border: "none",
      fontWeight: 700,
      cursor: "pointer",
    },
    btnGhost: {
      background: "rgba(255,255,255,0.15)",
      color: "white",
      border: "1px solid rgba(255,255,255,0.25)",
    },
    btnPrimary: {
      background: "white",
      color: "#111",
    },
    tile: {
      marginTop: 14,
      padding: 16,
      borderRadius: 14,
      background: "rgba(0,0,0,0.3)",
      border: "1px solid rgba(255,255,255,0.2)",
      userSelect: "none",
      WebkitUserSelect: "none",
      touchAction: "pan-y", // allow vertical scroll but still capture horizontal intent
    },
    quote: { fontSize: 16, lineHeight: 1.6, margin: 0 },
    hint: {
      marginTop: 10,
      fontSize: 12,
      color: "rgba(255,255,255,0.8)",
    },
  };

  if (!slug) return null;

  // ---------- Coach Notes ----------
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
            <button
              style={{ ...styles.btn, ...styles.btnGhost }}
              onClick={() => router.push("/")}
            >
              ← Back
            </button>

            <h1>Coach Notes</h1>
            <p>Add your own notes from coaches, training, or competition.</p>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Type your notes here…"
              style={{
                width: "100%",
                minHeight: 220,
                marginTop: 10,
                padding: 12,
                borderRadius: 12,
                background: "rgba(0,0,0,0.3)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                outline: "none",
              }}
            />

            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                style={{ ...styles.btn, ...styles.btnPrimary }}
                onClick={() => {
                  localStorage.setItem("coachNotes", notes);
                  alert("Saved ✅");
                }}
              >
                Save
              </button>
              <button
                style={{ ...styles.btn, ...styles.btnGhost }}
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

            <div style={styles.hint}>Your notes are saved on this device.</div>
          </main>
        </div>
      </div>
    );
  }

  // ---------- Normal categories ----------
  const categoryKey = String(slug);
  const list = affirmations[categoryKey];
  const title = TITLES[categoryKey] || categoryKey;

  if (!list) {
    return (
      <div style={styles.page}>
        <div style={styles.overlay}>
          <main style={styles.card}>
            <button
              style={{ ...styles.btn, ...styles.btnGhost }}
              onClick={() => router.push("/")}
            >
              ← Back
            </button>
            <h1>Not found</h1>
          </main>
        </div>
      </div>
    );
  }

  if (!FREE_KEYS.has(categoryKey)) {
    return (
      <div style={styles.page}>
        <div style={styles.overlay}>
          <main style={styles.card}>
            <button
              style={{ ...styles.btn, ...styles.btnGhost }}
              onClick={() => router.push("/")}
            >
              ← Back
            </button>
            <h1>{title}</h1>
            <p>🔒 This category is locked. Premium coming soon.</p>
            <button
              style={{ ...styles.btn, ...styles.btnPrimary }}
              onClick={() => alert("Premium unlock is coming soon!")}
            >
              Unlock (Coming Soon)
            </button>
          </main>
        </div>
      </div>
    );
  }

  // ---------- Swipe-enabled affirmations ----------
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [categoryKey]);

  const next = () => setIndex((i) => (i + 1) % list.length);
  const prev = () => setIndex((i) => (i - 1 + list.length) % list.length);

  const current = list[index];

  // Touch swipe tracking
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
    // If user scrolls vertically, don’t treat it as swipe
    if (!isSwiping.current) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - startX.current);
    const dy = Math.abs(t.clientY - startY.current);
    if (dy > dx + 10) {
      isSwiping.current = false;
    }
  };

  const onTouchEnd = (e) => {
    if (!startX.current || !isSwiping.current) return;

    const t = e.changedTouches[0];
    const dx = t.clientX - startX.current;

    // Threshold: how far you need to swipe
    const THRESHOLD = 45;

    if (dx <= -THRESHOLD) next(); // swipe left
    if (dx >= THRESHOLD) prev();  // swipe right

    startX.current = null;
    startY.current = null;
    isSwiping.current = false;
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <main style={styles.card}>
          <button
            style={{ ...styles.btn, ...styles.btnGhost }}
            onClick={() => router.push("/")}
          >
            ← Back
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h1 style={{ marginBottom: 6 }}>{title}</h1>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
              {index + 1} / {list.length}
            </div>
          </div>

          <div
            style={styles.tile}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <p style={styles.quote}>“{current}”</p>
            <div style={styles.hint}>Swipe left/right, or use the buttons below.</div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={prev}>
              ← Prev
            </button>
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={next}>
              Next →
            </button>
            <button
              style={{ ...styles.btn, ...styles.btnGhost }}
              onClick={() => setIndex(Math.floor(Math.random() * list.length))}
            >
              Random
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

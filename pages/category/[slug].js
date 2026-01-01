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
      padding: "max(16px, env(safe-area-inset-top)) 14px max(16px, env(safe-area-inset-bottom))",
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
      marginBottom: 10,
    },
    backBtn: {
      padding: "10px 14px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.25)",
      background: "rgba(255,255,255,0.12)",
      color: "white",
      fontWeight: 800,
      cursor: "pointer",
    },
    title: { fontSize: 20, marginBottom: 6 },
    sub: { fontSize: 13, color: "rgba(255,255,255,0.9)" },
    tile: {
      marginTop: 14,
      padding: 16,
      borderRadius: 14,
      background: "rgba(0,0,0,0.28)",
      border: "1px solid rgba(255,255,255,0.2)",
      userSelect: "none",
      touchAction: "pan-y",
    },
    quoteWrap: {
      transition: "transform 180ms ease, opacity 180ms ease",
      willChange: "transform, opacity",
    },
    quote: { fontSize: 16, lineHeight: 1.6 },
    row: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 },
    primaryBtn: {
      padding: "12px",
      borderRadius: 12,
      border: "none",
      background: "white",
      color: "#111",
      fontWeight: 900,
      flex: "1 1 140px",
      cursor: "pointer",
    },
    softBtn: {
      padding: "12px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.25)",
      background: "rgba(255,255,255,0.12)",
      color: "white",
      fontWeight: 800,
      flex: "1 1 120px",
      cursor: "pointer",
    },
    toast: {
      marginTop: 10,
      fontSize: 12,
      color: "#b8ffcf",
    },
  };

  if (!slug) return null;

  /* ---------------- Coach Notes ---------------- */
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
            <button style={styles.backBtn} onClick={() => router.push("/")}>
              ← Back
            </button>
            <h1 style={styles.title}>Coach Notes</h1>
            <textarea
              style={{ width: "100%", minHeight: 240, marginTop: 12 }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div style={styles.row}>
              <button
                style={styles.primaryBtn}
                onClick={() => {
                  localStorage.setItem("coachNotes", notes);
                  alert("Saved");
                }}
              >
                Save
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /* ---------------- Categories ---------------- */
  const list = affirmations?.[slug];
  const title = TITLES[slug] || slug;

  if (!FREE_KEYS.has(slug)) {
    return (
      <div style={styles.page}>
        <div style={styles.overlay}>
          <main style={styles.card}>
            <button style={styles.backBtn} onClick={() => router.push("/")}>
              ← Back
            </button>
            <h1 style={styles.title}>{title}</h1>
            <p style={styles.sub}>🔒 This category is locked.</p>
          </main>
        </div>
      </div>
    );
  }

  const [index, setIndex] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [toast, setToast] = useState("");
  const animating = useRef(false);

  useEffect(() => {
    setIndex(0);
  }, [slug]);

  const animate = (nextIndex, dir) => {
    if (animating.current) return;
    animating.current = true;

    setOffsetX(dir === "next" ? -18 : 18);
    setOpacity(0);

    setTimeout(() => {
      setIndex(nextIndex);
      setOffsetX(dir === "next" ? 18 : -18);
      setOpacity(0);

      setTimeout(() => {
        setOffsetX(0);
        setOpacity(1);
        animating.current = false;
      }, 180);
    }, 140);
  };

  const next = () => animate((index + 1) % list.length, "next");
  const prev = () => animate((index - 1 + list.length) % list.length, "prev");

  /* ---------------- SHARE ---------------- */
  const shareAffirmation = async () => {
    const text = `“${list[index]}” — ${title}\n\nThe Mental Caddie`;

    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setToast("Copied to clipboard");
      }
    } catch {
      await navigator.clipboard.writeText(text);
      setToast("Copied to clipboard");
    }

    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <main style={styles.card}>
          <div style={styles.topRow}>
            <button style={styles.backBtn} onClick={() => router.push("/")}>
              ← Back
            </button>
            <div style={{ fontSize: 12 }}>
              {index + 1}/{list.length}
            </div>
          </div>

          <h1 style={styles.title}>{title}</h1>

          <div style={styles.tile}>
            <div
              style={{
                ...styles.quoteWrap,
                transform: `translateX(${offsetX}px)`,
                opacity,
              }}
            >
              <p style={styles.quote}>“{list[index]}”</p>
            </div>
          </div>

          <div style={styles.row}>
            <button style={styles.softBtn} onClick={prev}>
              ← Prev
            </button>
            <button style={styles.primaryBtn} onClick={next}>
              Next →
            </button>
            <button style={styles.softBtn} onClick={shareAffirmation}>
              📤 Share
            </button>
          </div>

          {toast && <div style={styles.toast}>{toast}</div>}
        </main>
      </div>
    </div>
  );
}

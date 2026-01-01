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

  /* ---------------- Mobile-tuned styles ---------------- */
  const styles = {
    page: {
      minHeight: "100vh",
      backgroundImage: 'url("/golf-bg.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    overlay: {
      minHeight: "100vh",
      paddingTop: "max(12px, env(safe-area-inset-top))",
      paddingBottom: "max(24px, env(safe-area-inset-bottom))",
      paddingLeft: "12px",
      paddingRight: "12px",
     ;
      background: "linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.42))",
      display: "flex",
      alignItems: "flex-start",
    },
    card: {
      width: "100%",
      maxWidth: 520,
      borderRadius: 16,
      padding: 14,
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.18)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      color: "white",
    },
    topRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    backBtn: {
      padding: "8px 12px",
      borderRadius: 10,
      border: "1px solid rgba(255,255,255,0.25)",
      background: "rgba(255,255,255,0.12)",
      color: "white",
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
    },
    title: {
      fontSize: 18,
      margin: "4px 0 4px",
      lineHeight: 1.25,
    },
    sub: {
      fontSize: 12,
      color: "rgba(255,255,255,0.85)",
      marginBottom: 8,
    },
    tile: {
      marginTop: 10,
      padding: 14,
      borderRadius: 14,
      background: "rgba(0,0,0,0.28)",
      border: "1px solid rgba(255,255,255,0.2)",
      userSelect: "none",
      touchAction: "pan-y",
    },
    quoteWrap: {
      transition: "transform 160ms ease, opacity 160ms ease",
      willChange: "transform, opacity",
    },
    quote: {
      fontSize: 15,
      lineHeight: 1.55,
      margin: 0,
    },
    row: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginTop: 12,
    },
    primaryBtn: {
      padding: "10px",
      borderRadius: 10,
      border: "none",
      background: "white",
      color: "#111",
      fontWeight: 800,
      fontSize: 14,
      flex: "1 1 130px",
      cursor: "pointer",
    },
    softBtn: {
      padding: "10px",
      borderRadius: 10,
      border: "1px solid rgba(255,255,255,0.25)",
      background: "rgba(255,255,255,0.12)",
      color: "white",
      fontWeight: 700,
      fontSize: 13,
      flex: "1 1 110px",
      cursor: "pointer",
    },
    toast: {
      marginTop: 8,
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
              style={{
                width: "100%",
                minHeight: 220,
                marginTop: 10,
                padding: 10,
                borderRadius: 10,
                fontSize: 14,
              }}
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

    setOffsetX(dir === "next" ? -14 : 14);
    setOpacity(0);

    setTimeout(() => {
      setIndex(nextIndex);
      setOffsetX(dir === "next" ? 14 : -14);
      setOpacity(0);

      setTimeout(() => {
        setOffsetX(0);
        setOpacity(1);
        animating.current = false;
      }, 160);
    }, 120);
  };

  const next = () => animate((index + 1) % list.length, "next");
  const prev = () => animate((index - 1 + list.length) % list.length, "prev");

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
    setTimeout(() => setToast(""), 1800);
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

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { affirmations } from "../data/affirmations";

export default function Home() {
  const router = useRouter();

  // Free categories
  const FREE_KEYS = new Set(["Confidence", "Focus"]);

  // Exact display order
  const ORDERED_CATEGORIES = [
    "Confidence",
    "Focus",
    "Technique",
    "Growth",
    "PreRound",
    "TournamentMindset",
    "CourseManagement",
    "Resilience",
    "Recovery",
  ];

  // Display names
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

  // Section descriptions
  const DESCRIPTIONS = {
    Confidence:
      "Build belief in your swing, your preparation, and your ability to perform.",
    Focus: "Stay present, calm, and committed to one shot at a time.",
    Technique:
      "Reinforce trust in your fundamentals without overthinking mechanics.",
    Growth: "Develop a long-term mindset focused on learning and improvement.",
    PreRound: "Prepare mentally before you step onto the first tee.",
    TournamentMindset:
      "Stay composed, adaptable, and confident under competition pressure.",
    CourseManagement: "Make smart decisions that support consistent scoring.",
    Resilience: "Bounce back quickly and stay mentally strong in tough moments.",
    Recovery: "Reset emotionally after mistakes and refocus for the next shot.",
  };

  const goToCategory = (slug, isLocked) => {
    if (isLocked) {
      alert("This category is locked for now. Premium unlock coming soon!");
      return;
    }
    router.push(`/category/${slug}`);
  };

  // ---------- Affirmation of the Day (free only) ----------
  const todayKey = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const freePool = useMemo(() => {
    const pool = [];
    for (const cat of ["Confidence", "Focus"]) {
      const arr = affirmations?.[cat];
      if (Array.isArray(arr)) {
        for (const text of arr) {
          if (typeof text === "string" && text.trim()) {
            pool.push({ category: cat, text: text.trim() });
          }
        }
      }
    }
    return pool;
  }, []);

  const [aotd, setAotd] = useState(null);

  const hashString = (s) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  };

  const pickForToday = () => {
    if (!freePool.length) return null;
    const idx = hashString(todayKey) % freePool.length;
    return freePool[idx];
  };

  useEffect(() => {
    if (!freePool.length) return;

    const storageKey = `aotd:${todayKey}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.text && parsed?.category) {
          setAotd(parsed);
          return;
        }
      } catch (_) {}
    }

    const pick = pickForToday();
    setAotd(pick);
    if (pick) localStorage.setItem(storageKey, JSON.stringify(pick));
  }, [todayKey, freePool]); // eslint-disable-line react-hooks/exhaustive-deps

  const newFreePick = () => {
    if (!freePool.length) return;
    const storageKey = `aotd:${todayKey}`;
    const currentText = aotd?.text;

    let next = null;
    if (freePool.length === 1) {
      next = freePool[0];
    } else {
      for (let tries = 0; tries < 10; tries++) {
        const idx = Math.floor(Math.random() * freePool.length);
        if (freePool[idx].text !== currentText) {
          next = freePool[idx];
          break;
        }
      }
      next = next || freePool[0];
    }

    setAotd(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  // ---------- UI styles ----------
  const styles = {
    page: {
      minHeight: "100vh",
      padding: 20,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      backgroundImage: 'url("/golf-bg.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    },
    overlay: {
      minHeight: "100vh",
      padding: 20,
      background:
        "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.35))",
      display: "flex",
      justifyContent: "center",
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
    h1: { margin: "6px 0 8px", fontSize: 26, lineHeight: 1.2 },
    p: { margin: "0 0 16px", color: "rgba(255,255,255,0.9)", lineHeight: 1.5 },
    primaryBtn: {
      width: "100%",
      padding: "14px 14px",
      fontSize: 16,
      borderRadius: 12,
      background: "white",
      color: "#111",
      border: "none",
      cursor: "pointer",
      fontWeight: 700,
      marginBottom: 16,
    },
    tile: {
      padding: 14,
      borderRadius: 14,
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.18)",
      cursor: "pointer",
      marginBottom: 12,
    },
    tileTitleRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 18,
      fontWeight: 700,
    },
    tileDesc: {
      marginTop: 6,
      marginBottom: 0,
      fontSize: 14,
      color: "rgba(255,255,255,0.85)",
      lineHeight: 1.4,
    },
    aotdCard: {
      padding: 14,
      borderRadius: 14,
      background: "rgba(0,0,0,0.28)",
      border: "1px solid rgba(255,255,255,0.18)",
      marginBottom: 14,
    },
    tag: {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 12,
      background: "rgba(255,255,255,0.18)",
      border: "1px solid rgba(255,255,255,0.22)",
      color: "white",
    },
    smallBtn: {
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.22)",
      cursor: "pointer",
      background: "rgba(255,255,255,0.12)",
      color: "white",
      fontWeight: 600,
    },
    smallBtnPrimary: {
      padding: "10px 12px",
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
      background: "white",
      color: "#111",
      fontWeight: 800,
    },
    row: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 },
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <main style={styles.card}>
          <h1 style={styles.h1}>
            Golf Affirmations - Find Your Perfect Swing Mindset
          </h1>
          <p style={styles.p}>
            Elevate your mental game with positive affirmations designed
            specifically for golfers. Build confidence, improve focus, and
            unlock your true potential on the course.
          </p>

          {/* Affirmation of the Day */}
          <div style={styles.aotdCard}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <strong>Affirmation of the Day</strong>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                {todayKey}
              </span>
            </div>

            {aotd ? (
              <>
                <div style={{ fontSize: 16, lineHeight: 1.5 }}>
                  “{aotd.text}”
                </div>

                <div style={{ marginTop: 10 }}>
                  <span style={styles.tag}>
                    {TITLES[aotd.category] || aotd.category}
                  </span>
                </div>

                <div style={styles.row}>
                  <button
                    onClick={() => router.push(`/category/${aotd.category}`)}
                    style={styles.smallBtnPrimary}
                  >
                    View {TITLES[aotd.category] || aotd.category}
                  </button>
                  <button onClick={newFreePick} style={styles.smallBtn}>
                    New one
                  </button>
                </div>
              </>
            ) : (
              <div style={{ color: "rgba(255,255,255,0.85)" }}>
                Add affirmations to Confidence and Focus to enable this section.
              </div>
            )}
          </div>

          <button
            onClick={() => alert("Premium unlock is coming soon!")}
            style={styles.primaryBtn}
          >
            🔓 Unlock Full Access (Coming Soon)
          </button>

          {/* Categories */}
          {ORDERED_CATEGORIES.map((key) => {
            if (!affirmations[key]) return null;
            const isLocked = !FREE_KEYS.has(key);

            return (
              <div
                key={key}
                onClick={() => goToCategory(key, isLocked)}
                style={styles.tile}
              >
                <div style={styles.tileTitleRow}>
                  <span>{TITLES[key]}</span>
                  {isLocked && <span>🔒</span>}
                </div>
                <p style={styles.tileDesc}>{DESCRIPTIONS[key]}</p>
              </div>
            );
          })}

          {/* Coach Notes always last */}
          <div
            onClick={() => router.push(`/category/coachNotes`)}
            style={styles.tile}
          >
            <div style={styles.tileTitleRow}>
              <span>Coach Notes</span>
              <span>📝</span>
            </div>
            <p style={styles.tileDesc}>
              Your personal notes from coaches, practice sessions, or competitions.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}


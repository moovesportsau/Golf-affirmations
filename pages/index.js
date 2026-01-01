import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { affirmations } from "../data/affirmations";

export default function Home() {
  const router = useRouter();

  const FREE_KEYS = new Set(["Confidence", "Focus"]);

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

  // ---------- Affirmation of the Day ----------
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

    const idx = hashString(todayKey) % freePool.length;
    const pick = freePool[idx];
    setAotd(pick);
    localStorage.setItem(storageKey, JSON.stringify(pick));
  }, [todayKey, freePool]);

  const newFreePick = () => {
    if (!freePool.length) return;

    const storageKey = `aotd:${todayKey}`;
    const currentText = aotd?.text;

    let next = freePool[Math.floor(Math.random() * freePool.length)];
    if (freePool.length > 1) {
      for (let i = 0; i < 10; i++) {
        const candidate = freePool[Math.floor(Math.random() * freePool.length)];
        if (candidate.text !== currentText) {
          next = candidate;
          break;
        }
      }
    }

    setAotd(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  // ---------- Mobile-first styles ----------
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
      maxWidth: 560, // better on phones + still nice on desktop
      borderRadius: 18,
      padding: 16,
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.18)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      color: "white",
    },
    h1: { margin: "4px 0 8px", fontSize: 22, lineHeight: 1.2 },
    p: { margin: "0 0 14px", color: "rgba(255,255,255,0.92)", lineHeight: 1.5, fontSize: 14 },
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
    row: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 },
    btnPrimary: {
      padding: "12px 14px",
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
      background: "white",
      color: "#111",
      fontWeight: 900,
      width: "100%",
      fontSize: 15,
    },
    btnSoft: {
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.22)",
      cursor: "pointer",
      background: "rgba(255,255,255,0.12)",
      color: "white",
      fontWeight: 700,
      fontSize: 14,
      flex: "1 1 auto",
    },
    tile: {
      padding: 14,
      borderRadius: 14,
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.18)",
      marginBottom: 12,
      cursor: "pointer",
    },
    tileTitleRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 17,
      fontWeight: 800,
    },
    tileDesc: {
      marginTop: 6,
      marginBottom: 0,
      fontSize: 13,
      color: "rgba(255,255,255,0.88)",
      lineHeight: 1.35,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <main style={styles.card}>
          <h1 style={styles.h1}>The Mental Caddie</h1>
          <p style={styles.p}>
            Elevate your mental game with positive affirmations designed specifically for golfers.
            Build confidence, improve focus, and unlock your true potential on the course.
          </p>

          <div style={styles.aotdCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>Affirmation of the Day</strong>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{todayKey}</span>
            </div>

            {aotd ? (
              <>
                <div style={{ fontSize: 15, lineHeight: 1.55, marginTop: 10 }}>
                  “{aotd.text}”
                </div>

                <div style={{ marginTop: 10 }}>
                  <span style={styles.tag}>{TITLES[aotd.category] || aotd.category}</span>
                </div>

                <div style={styles.row}>
                  <button
                    onClick={() => router.push(`/category/${aotd.category}`)}
                    style={{ ...styles.btnSoft, flex: "1 1 180px" }}
                  >
                    View {TITLES[aotd.category] || aotd.category}
                  </button>
                  <button onClick={newFreePick} style={{ ...styles.btnSoft, flex: "1 1 120px" }}>
                    New one
                  </button>
                </div>
              </>
            ) : (
              <div style={{ color: "rgba(255,255,255,0.85)", marginTop: 10 }}>
                Add affirmations to Confidence and Focus to enable this section.
              </div>
            )}
          </div>

          <button onClick={() => alert("Premium unlock is coming soon!")} style={styles.btnPrimary}>
            🔓 Unlock Full Access (Coming Soon)
          </button>

          <div style={{ height: 14 }} />

          {ORDERED_CATEGORIES.map((key) => {
            if (!affirmations[key]) return null;
            const isLocked = !FREE_KEYS.has(key);

            return (
              <div key={key} onClick={() => goToCategory(key, isLocked)} style={styles.tile}>
                <div style={styles.tileTitleRow}>
                  <span>{TITLES[key]}</span>
                  {isLocked && <span>🔒</span>}
                </div>
                <p style={styles.tileDesc}>{DESCRIPTIONS[key]}</p>
              </div>
            );
          })}

          <div onClick={() => router.push(`/category/coachNotes`)} style={styles.tile}>
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

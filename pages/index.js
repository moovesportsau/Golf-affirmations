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
    Confidence: "Build belief in your swing, your preparation, and your ability to perform.",
    Focus: "Stay present, calm, and committed to one shot at a time.",
    Technique: "Reinforce trust in your fundamentals without overthinking mechanics.",
    Growth: "Develop a long-term mindset focused on learning and improvement.",
    PreRound: "Prepare mentally before you step onto the first tee.",
    TournamentMindset: "Stay composed, adaptable, and confident under competition pressure.",
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

  // ---------- UI ----------
  return (
    <main style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Golf Affirmations</h1>
      <p>Mental strength training for competitive and junior golfers.</p>

      {/* Affirmation of the Day */}
      <div
        style={{
          padding: 16,
          marginBottom: 16,
          borderRadius: 12,
          background: "#f5f5f5",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <strong style={{ fontSize: 16 }}>Affirmation of the Day</strong>
          <span style={{ fontSize: 12, color: "#555" }}>{todayKey}</span>
        </div>

        {aotd ? (
          <>
            <div style={{ fontSize: 16, lineHeight: 1.5, marginBottom: 8 }}>
              “{aotd.text}”
            </div>

            {/* ✅ Category tag */}
            <div style={{ marginBottom: 10 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  background: "#fff",
                  border: "1px solid #ddd",
                  color: "#333",
                }}
              >
                {TITLES[aotd.category] || aotd.category}
              </span>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => router.push(`/category/${aotd.category}`)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: "#000",
                  color: "#fff",
                }}
              >
                View {TITLES[aotd.category] || aotd.category}
              </button>

              <button
                onClick={newFreePick}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                New one
              </button>
            </div>
          </>
        ) : (
          <div style={{ color: "#555" }}>
            Add affirmations to Confidence and Focus to enable this section.
          </div>
        )}
      </div>

      {/* Coming soon premium */}
      <button
        onClick={() => alert("Premium unlock is coming soon!")}
        style={{
          padding: 14,
          marginBottom: 20,
          width: "100%",
          fontSize: 16,
          borderRadius: 10,
          background: "#000",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
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
            style={{
              padding: 16,
              marginBottom: 12,
              borderRadius: 12,
              background: "#f5f5f5",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              <span>{TITLES[key]}</span>
              {isLocked && <span>🔒</span>}
            </div>

            <p
              style={{
                marginTop: 6,
                marginBottom: 0,
                fontSize: 14,
                color: "#555",
                lineHeight: 1.4,
              }}
            >
              {DESCRIPTIONS[key]}
            </p>
          </div>
        );
      })}

      {/* Coach Notes always last */}
      <div
        onClick={() => goToCategory("coachNotes", false)}
        style={{
          padding: 16,
          marginBottom: 12,
          borderRadius: 12,
          background: "#f5f5f5",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          <span>Coach Notes</span>
          <span>📝</span>
        </div>
        <p style={{ marginTop: 6, marginBottom: 0, fontSize: 14, color: "#555" }}>
          Your personal notes from coaches, practice sessions, or competitions.
        </p>
      </div>
    </main>
  );
}


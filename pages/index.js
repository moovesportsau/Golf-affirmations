import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { affirmations } from "../data/affirmations";

const ORDER = [
  "Confidence",
  "Focus",
  "Technique",
  "Growth",
  "PreRound",
  "TournamentMindset",
  "CourseManagement",
  "Resilience",
  "Recovery",
  "coachNotes",
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
  coachNotes: "Coach Notes",
};

const DESCS = {
  Confidence: "Build belief and trust in your swing under pressure.",
  Focus: "Stay present, calm, and locked in on every shot.",
  Technique: "Commit to fundamentals and swing with freedom.",
  Growth: "Progress over perfection — learn every round.",
  PreRound: "Start calm, confident, and ready to compete.",
  TournamentMindset: "Relax, adapt, and play one shot at a time.",
  CourseManagement: "Play smart targets and make disciplined decisions.",
  Resilience: "Bounce back fast and finish strong.",
  Recovery: "Reset after mistakes and respond, not react.",
  coachNotes: "Write and save personal notes for your game.",
};

const FREE_KEYS = new Set(["Confidence", "Focus", "coachNotes"]);
const PAID_KEY = "tmc:paid_v1";

/* ================= DAILY AFFIRMATION HELPERS ================= */
function getBrisbaneDayKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Brisbane",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;

  return `${y}-${m}-${d}`; // YYYY-MM-DD
}

function hashStringToInt(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickDailyFromList(list, key) {
  if (!Array.isArray(list) || list.length === 0) return "";
  const idx = hashStringToInt(key) % list.length;
  return list[idx];
}
/* ============================================================= */

export default function HomePage() {
  const router = useRouter();
  const [paid, setPaid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  // Daily affirmation (stable for the day in Brisbane time)
  const [dailyAffirmation, setDailyAffirmation] = useState("");
  const dayKey = useMemo(() => getBrisbaneDayKey(new Date()), []);

  // If user returns from Stripe success, mark paid
  useEffect(() => {
    if (!router.isReady) return;
    const paidParam = router.query.paid;
    if (paidParam === "1") {
      try {
        localStorage.setItem(PAID_KEY, "1");
      } catch {}
      setPaid(true);
      setToast("Unlocked ✓");
      setTimeout(() => setToast(""), 1400);
      // clean the URL
      router.replace("/", undefined, { shallow: true });
    }
  }, [router.isReady, router.query.paid]);

  // Load paid flag
  useEffect(() => {
    try {
      setPaid(localStorage.getItem(PAID_KEY) === "1");
    } catch {
      setPaid(false);
    }
  }, []);

   // Pick today's affirmation (from all categories combined)
  useEffect(() => {
    const all = Object.values(affirmations).flat().filter(Boolean);

    const storageKey = `dailyAffirmation:${dayKey}`;
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        setDailyAffirmation(cached);
        return;
      }
    } catch {}

    const picked = pickDailyFromList(all, dayKey);
    setDailyAffirmation(picked);

    try {
      localStorage.setItem(storageKey, picked);
    } catch {}
  }, [dayKey]);

  const lockedCount = useMemo(() => {
    let n = 0;
    ORDER.forEach((k) => {
      if (!FREE_KEYS.has(k)) n += 1;
    });
    return n;
  }, []);

  const isLocked = (key) => !paid && !FREE_KEYS.has(key);

  const goCategory = (key) => {
    router.push(`/category/${key}`);
  };

  const startCheckout = async () => {
    try {
      setBusy(true);
      setToast("");

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Checkout failed");
      }

      const data = await res.json();
      if (!data?.url) throw new Error("No checkout URL returned");

      window.location.href = data.url;
    } catch (e) {
      setToast("Payment setup error");
      setTimeout(() => setToast(""), 1600);
    } finally {
      setBusy(false);
    }
  };

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
    unlockRow: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      alignItems: "center",
      marginBottom: 14,
    },
    unlockBtn: {
      padding: "14px 14px",
      borderRadius: 14,
      border: "none",
      background: "white",
      color: "#111",
      fontWeight: 900,
      fontSize: 16,
      cursor: "pointer",
      flex: "1 1 220px",
      textAlign: "center",
    },
    ghostBtn: {
      padding: "14px 14px",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.25)",
      background: "rgba(255,255,255,0.12)",
      color: "white",
      fontWeight: 900,
      fontSize: 16,
      cursor: "pointer",
      flex: "1 1 140px",
      textAlign: "center",
    },
    toast: {
      marginTop: 8,
      fontSize: 13,
      color: "#b8ffcf",
      fontWeight: 700,
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
    lock: { opacity: 0.95, fontSize: 18 },
    tileDesc: { margin: 0, opacity: 0.9, lineHeight: 1.35, fontSize: 13 },
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <main style={styles.card}>
          <h1 style={styles.h1}>The Mental Caddie</h1>
          <p style={styles.p}>
            Elevate your mental game with positive affirmations designed 
            specially designed for golfers. Build confidence, improve focus,
            and unlock your true potential on the course.
          </p>

          {/* Daily Affirmation (shows before unlock button) */}
          <div
            style={{
              marginTop: 10,
              marginBottom: 14,
              padding: 14,
              borderRadius: 16,
              background: "rgba(0,0,0,0.28)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 8 }}>
              Daily Affirmation
            </div>
            <div style={{ fontSize: 18, lineHeight: 1.35 }}>
              {dailyAffirmation || "Loading..."}
            </div>
          </div>

          {!paid ? (
            <div style={styles.unlockRow}>
              <button
                style={{ ...styles.unlockBtn, opacity: busy ? 0.7 : 1 }}
                onClick={startCheckout}
                disabled={busy}
              >
                Unlock Full Access — $3.49 one-time
              </button>
              <button
                style={styles.ghostBtn}
                onClick={() => router.push("/favorites")}
              >
                Favorites
              </button>
              <div style={{ flex: "1 1 100%" }} />
              <p style={{ ...styles.p, margin: "0" }}>
                {lockedCount} categories unlocked with full access paid.
              </p>
            </div>
          ) : (
            <div style={styles.unlockRow}>
              <button style={styles.unlockBtn} onClick={() => router.push("/favorites")}>
                Favorites
              </button>
              <button
                style={styles.ghostBtn}
                onClick={() => {
                  try {
                    localStorage.removeItem(PAID_KEY);
                  } catch {}
                  setPaid(false);
                  setToast("Locked again");
                  setTimeout(() => setToast(""), 1400);
                }}
              >
                (Admin) Lock again
              </button>
            </div>
          )}

          {toast ? <div style={styles.toast}>{toast}</div> : null}

          <div style={styles.grid}>
            {ORDER.map((k) => {
              const locked = isLocked(k);
              return (
                <div
                  key={k}
                  onClick={() => goCategory(k)}
                  style={{
                    ...styles.tile,
                    opacity: locked ? 0.85 : 1,
                  }}
                >
                  <div style={styles.tileTitleRow}>
                    <h2 style={styles.tileTitle}>{TITLES[k]}</h2>
                    {locked ? <span style={styles.lock}>🔒</span> : <span>›</span>}
                  </div>
                  <p style={styles.tileDesc}>{DESCS[k]}</p>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { affirmations } from "../../data/affirmations";

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;

  // Free categories (locked ones show a lock screen)
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
    coachNotes: "Coach Notes",
  };

  /* ---------------- Mobile-tuned styles ---------------- */
  const styles = {
    page: {
      minHeight: "var(--app-height, 100vh)",
      backgroundImage: 'url("/golf-bg.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    overlay: {
      minHeight: "var(--app-height, 100vh)",
      paddingTop: "max(12px, env(safe-area-inset-top))",
      paddingBottom: "max(24px, env(safe-area-inset-bottom))",
      paddingLeft: 12,
      paddingRight: 12,
      background: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.35))",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
    },
    card: {
      width: "100%",
      maxWidth: 520,
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
    topRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
    },
    backBtn: {
      padding: "10px 14px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,0.25)",
      background: "rgba(255,255,255,0.12)",
      color: "white",
      fontWeight: 800,
      fontSize: 14,
      cursor: "pointer",
      minWidth: 110,
      textAlign: "center",
    },
    pill: {
      padding: "10px 14px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,0.20)",
      background: "rgba(255,255,255,0.10)",
      color: "white",
      fontWeight: 800,
      fontSize: 14,
      minWidth: 80,
      textAlign: "center",
      opacity: 0.95,
    },
    title: {
      fontSize: 34,
      margin: "6px 0 6px",
      lineHeight: 1.05,
      fontWeight: 900,
      letterSpacing: -0.5,
      textAlign: "left",
    },
    sub: {
      fontSize: 13,
      color: "rgba(255,255,255,0.85)",
      marginBottom: 10,
      textAlign: "left",
    },
    tile: {
      marginTop: 14,
      padding: 18,
      borderRadius: 18,
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
      fontSize: 26,
      lineHeight: 1.25,
      margin: 0,
      fontWeight: 800,
      textAlign: "left",
      wordBreak: "break-word",
      overflowWrap: "anywhere",
    },
    row: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      marginTop: 16,
    },
    primaryBtn: {
      padding: "14px 14px",
      borderRadius: 14,
      border: "none",
      background: "white",
      color: "#111",
      fontWeight: 900,
      fontSize: 18,
      flex: "1 1 160px",
      cursor: "pointer",
      textAlign: "center",
    },
    softBtn: {
      padding: "14px 14px",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.25)",
      background: "rgba(255,255,255,0.12)",
      color: "white",
      fontWeight: 900,
      fontSize: 18,
      flex: "1 1 160px",
      cursor: "pointer",
      textAlign: "center",
    },
    toast: {
      marginTop: 10,
      fontSize: 13,
      color: "#b8ffcf",
      fontWeight: 700,
    },
    textarea: {
      width: "100%",
      boxSizing: "border-box",
      minHeight: 240,
      marginTop: 10,
      padding: 14,
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.22)",
      background: "rgba(0,0,0,0.18)",
      color: "white",
      fontSize: 16,
      lineHeight: 1.5,
      resize: "vertical",
      outline: "none",
    },
  };

  if (!slug) return null;

  // --- Normalize incoming slug -> data key ---
  const keyFromSlug = (raw) => {
    const s = String(raw || "").trim();
    if (!s) return "";
    const lower = s.toLowerCase();
    if (lower === "coachnotes" || lower === "coach-notes") return "coachNotes";

    const cleaned = s.replace(/[-_\s]/g, "").toLowerCase();
    const map = {
      confidence: "Confidence",
      focus: "Focus",
      technique: "Technique",
      growth: "Growth",
      preround: "PreRound",
      tournamentmindset: "TournamentMindset",
      coursemanagement: "CourseManagement",
      resilience: "Resilience",
      recovery: "Recovery",
    };
    return map[cleaned] || s;
  };

  const key = keyFromSlug(slug);
  const title = TITLES[key] || String(slug);

  // ---- Favorites storage (supports old keys too) ----
  const FAVORITES_KEYS = ["tmc:favorites", "tmf_favorites", "tmc_favorites"];

  const readFavorites = () => {
    for (const k of FAVORITES_KEYS) {
      try {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return { key: k, arr };
      } catch {}
    }
    return { key: FAVORITES_KEYS[0], arr: [] };
  };

  const writeFavorites = (arr) => {
    // Write to primary key, and also mirror to the other keys for compatibility
    for (const k of FAVORITES_KEYS) {
      try {
        localStorage.setItem(k, JSON.stringify(arr));
      } catch {}
    }
  };

  const [toast, setToast] = useState("");

  const setToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1200);
  };

  const getShareUrl = () => {
    try {
      const origin = window.location.origin;
      const path = router.asPath.split("?")[0];
      return `${origin}${path}`;
    } catch {
      return "";
    }
  };

  const shareWithLink = async (text) => {
    const url = getShareUrl();
    const payloadText = url ? `${text}\n\n${url}` : text;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "The Mental Caddie",
          text: payloadText,
          url: url || undefined,
        });
      } else {
        await navigator.clipboard.writeText(payloadText);
        setToastMsg("Copied");
      }
    } catch {}
  };

  // --- Coach Notes: keep as simple free text + share ---
  if (key === "coachNotes") {
    const [notes, setNotes] = useState("");

    useEffect(() => {
      try {
        const saved = localStorage.getItem("coachNotes:text");
        if (saved) setNotes(saved);
      } catch {}
    }, []);

    const save = () => {
      try {
        localStorage.setItem("coachNotes:text", notes);
        setToastMsg("Saved ✓");
      } catch {
        setToastMsg("Could not save");
      }
    };

    return (
      <div style={styles.page}>
        <div style={styles.overlay}>
          <main style={styles.card}>
            <div style={styles.topRow}>
              <button style={styles.backBtn} onClick={() => router.push("/")}>
                ← Home
              </button>
              <div style={styles.pill}>Notes</div>
            </div>

            <h1 style={styles.title}>Coach Notes</h1>
            <p style={styles.sub}>Write anything you want to remember.</p>

            <div style={styles.tile}>
              <textarea
                style={styles.textarea}
                placeholder="Write your coach notes here…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div style={styles.row}>
              <button style={styles.primaryBtn} onClick={save}>
                Save
              </button>
              <button
                style={styles.softBtn}
                onClick={() => shareWithLink(notes || "My Coach Notes")}
              >
                Share
              </button>
              <button
                style={styles.softBtn}
                onClick={() => {
                  setNotes("");
                  try {
                    localStorage.removeItem("coachNotes:text");
                  } catch {}
                  setToastMsg("Cleared ✓");
                }}
              >
                Clear
              </button>
            </div>

            {toast ? <div style={styles.toast}>{toast}</div> : null}
          </main>
        </div>
      </div>
    );
  }

  // --- Regular categories ---
  const list = affirmations?.[key] || [];
  const isFree = FREE_KEYS.has(key);

  if (!isFree) {
    return (
      <div style={styles.page}>
        <div style={styles.overlay}>
          <main style={styles.card}>
            <div style={styles.topRow}>
              <button style={styles.backBtn} onClick={() => router.push("/")}>
                ← Home
              </button>
              <div style={styles.pill}>Locked</div>
            </div>

            <h1 style={styles.title}>{title}</h1>
            <p style={styles.sub}>🔒 This category is locked,
               Unlock for Full Access.</p>
          </main>
        </div>
      </div>
    );
  }

  const [index, setIndex] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const animating = useRef(false);

  useEffect(() => {
    setIndex(0);
  }, [key]);

  const safeLen = list.length || 1;

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

  const next = () => animate((index + 1) % safeLen, "next");
  const prev = () => animate((index - 1 + safeLen) % safeLen, "prev");

  const current = list[index] || "No affirmations found.";

  const isFavorited = () => {
    try {
      const { arr } = readFavorites();
      return arr.some((x) => x?.slug === key && x?.text === current);
    } catch {
      return false;
    }
  };

  const toggleFavorite = () => {
    try {
      const { arr } = readFavorites();
      const exists = arr.some((x) => x?.slug === key && x?.text === current);

      const nextArr = exists
        ? arr.filter((x) => !(x?.slug === key && x?.text === current))
        : [{ slug: key, title, text: current }, ...arr];

      writeFavorites(nextArr);
      setToastMsg(exists ? "Removed from Favorites" : "Saved to Favorites");
    } catch {
      setToastMsg("Could not update favorites");
    }
  };

  const fav = isFavorited();

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <main style={styles.card}>
          <div style={styles.topRow}>
            <button style={styles.backBtn} onClick={() => router.push("/")}>
              ← Home
            </button>
            <div style={styles.pill}>
              {list.length ? `${index + 1}/${list.length}` : "0/0"}
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
              <p style={styles.quote}>{current}</p>
            </div>
          </div>

          {/* Prev/Next */}
          <div style={styles.row}>
            <button style={styles.softBtn} onClick={prev}>
              ← Prev
            </button>
            <button style={styles.primaryBtn} onClick={next}>
              Next →
            </button>
          </div>

          {/* Share + Favorites */}
          <div style={styles.row}>
            <button
              style={styles.softBtn}
              onClick={() => shareWithLink(current)}
            >
              Share
            </button>

            <button style={styles.softBtn} onClick={toggleFavorite}>
              {fav ? "♥ Favorited" : "♡ Favorite"}
            </button>

            <button
              style={styles.softBtn}
              onClick={() => router.push("/favorites")}
            >
              Favorites
            </button>
          </div>

          {toast ? <div style={styles.toast}>{toast}</div> : null}
        </main>
      </div>
    </div>
  );
}

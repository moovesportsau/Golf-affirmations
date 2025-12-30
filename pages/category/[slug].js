import { useEffect, useState } from "react";
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
      backdropFilter: "blur(10px)",
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
      padding: 14,
      borderRadius: 14,
      background: "rgba(0,0,0,0.3)",
      border: "1px solid rgba(255,255,255,0.2)",
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
              }}
            />

            <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
              <button
                style={{ ...styles.btn, ...styles.btnPrimary }}
                onClick={() => {
                  localStorage.setItem("coachNotes", notes);
                  alert("Saved");
                }}
              >
                Save
              </button>
              <button
                style={{ ...styles.btn, ...styles.btnGhost }}
                onClick={() => {
                  setNotes("");
                  localStorage.removeItem("coachNotes");
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
          </main>
        </div>
      </div>
    );
  }

  const [index, setIndex] = useState(0);
  const current = list[index];

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

          <div style={styles.tile}>
            <p>“{current}”</p>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button
              style={{ ...styles.btn, ...styles.btnGhost }}
              onClick={() =>
                setIndex((i) => (i - 1 + list.length) % list.length)
              }
            >
              Prev
            </button>
            <button
              style={{ ...styles.btn, ...styles.btnPrimary }}
              onClick={() => setIndex((i) => (i + 1) % list.length)}
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}


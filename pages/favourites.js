import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function FavoritesPage() {
  const router = useRouter();

  const FAVORITES_KEY = "tmc:favorites";
  const [favs, setFavs] = useState([]);

  const load = () => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      setFavs(raw ? JSON.parse(raw) : []);
    } catch {
      setFavs([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const removeOne = (text) => {
    const next = favs.filter((f) => f?.text !== text);
    setFavs(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  };

  const clearAll = () => {
    if (!confirm("Clear all favorites?")) return;
    setFavs([]);
    localStorage.removeItem(FAVORITES_KEY);
  };

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
      paddingBottom: "max(12px, env(safe-area-inset-bottom))",
      paddingLeft: "12px",
      paddingRight: "12px",
      background: "linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.42))",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
    },
    card: {
      width: "100%",
      maxWidth: 560,
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
      gap: 10,
      marginBottom: 10,
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
    title: { fontSize: 18, margin: "4px 0 10px" },
    sub: { fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: -6 },
    item: {
      padding: 12,
      borderRadius: 14,
      background: "rgba(0,0,0,0.28)",
      border: "1px solid rgba(255,255,255,0.18)",
      marginTop: 10,
    },
    quote: { margin: 0, fontSize: 15, lineHeight: 1.55 },
    metaRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
      marginTop: 8,
      fontSize: 12,
      color: "rgba(255,255,255,0.82)",
    },
    softBtn: {
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid rgba(255,255,255,0.25)",
      background: "rgba(255,255,255,0.12)",
      color: "white",
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <main style={styles.card}>
          <div style={styles.topRow}>
            <button style={styles.backBtn} onClick={() => router.push("/")}>
              ← Back
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={styles.softBtn} onClick={load}>
                Refresh
              </button>
              <button style={styles.softBtn} onClick={clearAll}>
                Clear All
              </button>
            </div>
          </div>

          <h1 style={styles.title}>Favorites</h1>
          <div style={styles.sub}>
            Saved affirmations are stored on this device.
          </div>

          {favs.length === 0 ? (
            <div style={{ marginTop: 14, fontSize: 14, color: "rgba(255,255,255,0.9)" }}>
              No favorites yet. Tap <b>🤍 Favorite</b> on an affirmation to save it.
            </div>
          ) : (
            favs.map((f) => (
              <div key={f.text} style={styles.item}>
                <p style={styles.quote}>“{f.text}”</p>
                <div style={styles.metaRow}>
                  <span>{f.category || "Saved"}</span>
                  <button style={styles.softBtn} onClick={() => removeOne(f.text)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}

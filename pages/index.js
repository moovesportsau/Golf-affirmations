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

  return (
    <main style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Golf Affirmations</h1>
      <p>Mental strength training for competitive and junior golfers.</p>

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
        <p
          style={{
            marginTop: 6,
            marginBottom: 0,
            fontSize: 14,
            color: "#555",
          }}
        >
          Your personal notes from coaches, practice sessions, or competitions.
        </p>
      </div>
    </main>
  );
}


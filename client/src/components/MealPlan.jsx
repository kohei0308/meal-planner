import { useState } from "react";

function parsePlan(planText) {
  const dayRegex = /##\s*Day\s*(\d+)/gi;
  const shoppingRegex = /##\s*買い物リスト/i;

  const shoppingMatch = shoppingRegex.exec(planText);
  const mainText = shoppingMatch ? planText.slice(0, shoppingMatch.index) : planText;
  const shoppingText = shoppingMatch ? planText.slice(shoppingMatch.index) : null;

  const days = [];
  const matches = [...mainText.matchAll(dayRegex)];

  matches.forEach((match, index) => {
    const start = match.index;
    const end = matches[index + 1]?.index ?? mainText.length;
    const content = mainText.slice(start, end).trim();
    days.push({ dayNumber: parseInt(match[1], 10), content });
  });

  if (days.length === 0) {
    days.push({ dayNumber: 1, content: mainText });
  }

  return { days, shoppingText };
}

function formatInlineText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ fontWeight: 700, color: "#14532d" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderDayContent(content) {
  const lines = content.split("\n").slice(1);
  const result = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "---") continue;

    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      const text = trimmed.slice(2, -2);
      const isMealSlot = ["朝食", "昼食", "夕食"].some((t) => text.startsWith(t));
      result.push(
        <div
          key={key++}
          style={
            isMealSlot
              ? {
                  marginTop: "20px",
                  marginBottom: "8px",
                  fontWeight: 700,
                  color: "#15803d",
                  fontSize: "0.95rem",
                  borderLeft: "3px solid #16a34a",
                  paddingLeft: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "linear-gradient(90deg, rgba(220,252,231,0.6) 0%, transparent 100%)",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  borderRadius: "0 6px 6px 0",
                }
              : {
                  marginTop: "12px",
                  marginBottom: "4px",
                  fontWeight: 700,
                  color: "#64748b",
                  fontSize: "0.78rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }
          }
        >
          {isMealSlot ? (
            <>
              <span>
                {text.startsWith("朝食") ? "🌅" : text.startsWith("昼食") ? "☀️" : "🌙"}
              </span>
              {text}
            </>
          ) : (
            text
          )}
        </div>
      );
    } else if (trimmed.startsWith("- ")) {
      const text = trimmed.slice(2);
      result.push(
        <div
          key={key++}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            fontSize: "0.875rem",
            paddingTop: "3px",
            paddingBottom: "3px",
            color: "#374151",
          }}
        >
          <span style={{ flexShrink: 0, marginTop: "2px", color: "#16a34a" }}>·</span>
          <span>{formatInlineText(text)}</span>
        </div>
      );
    } else if (trimmed) {
      result.push(
        <p
          key={key++}
          style={{
            fontSize: "0.875rem",
            color: "#4b5563",
            marginTop: "4px",
            marginBottom: "4px",
            lineHeight: 1.7,
          }}
        >
          {trimmed}
        </p>
      );
    }
  }

  return result;
}

function renderShoppingList(shoppingText) {
  if (!shoppingText) return null;
  const lines = shoppingText.split("\n").slice(1);
  const result = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "---") continue;

    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      result.push(
        <h4
          key={key++}
          style={{
            fontWeight: 700,
            color: "#14532d",
            fontSize: "0.9rem",
            marginTop: "16px",
            marginBottom: "6px",
          }}
        >
          {trimmed.slice(2, -2)}
        </h4>
      );
    } else if (trimmed.startsWith("- ")) {
      result.push(
        <div
          key={key++}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.875rem",
            color: "#374151",
            paddingTop: "2px",
            paddingBottom: "2px",
          }}
        >
          <span style={{ color: "#16a34a" }}>✓</span>
          <span>{trimmed.slice(2)}</span>
        </div>
      );
    }
  }

  return result;
}

const DAY_ACCENTS = [
  { from: "#14532d", to: "#166534" },
  { from: "#166534", to: "#15803d" },
  { from: "#15803d", to: "#16a34a" },
  { from: "#14532d", to: "#15803d" },
  { from: "#166534", to: "#14532d" },
  { from: "#15803d", to: "#166534" },
  { from: "#14532d", to: "#16a34a" },
];

export default function MealPlan({ plan, onRegenerate }) {
  const [copied, setCopied] = useState(false);

  const { days, shoppingText } = parsePlan(plan.plan);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plan.plan);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = plan.plan;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="mt-10 animate-fade-in">
      {/* プランヘッダー */}
      <div
        className="rounded-2xl p-6 mb-8"
        style={{
          background: "linear-gradient(135deg, #14532d 0%, #166534 40%, #15803d 100%)",
          border: "1px solid rgba(74,222,128,0.25)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(74,222,128,0.15)",
                  color: "#86efac",
                  border: "1px solid rgba(74,222,128,0.3)",
                }}
              >
                Generated Plan
              </span>
            </div>
            <h2 className="text-2xl font-bold flex items-center gap-2 mt-1" style={{ color: "#ffffff" }}>
              <span>🍽️</span>
              {plan.days}日間の献立プラン
            </h2>

            <div className="flex flex-wrap gap-2 mt-3">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: "rgba(255,255,255,0.1)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                📅 {plan.days}日分
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: "rgba(255,255,255,0.1)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                👥 {plan.people}名
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: "rgba(255,255,255,0.1)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                🍴 {plan.style}
              </span>
              {plan.ingredients && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: "rgba(74,222,128,0.2)", color: "#86efac", border: "1px solid rgba(74,222,128,0.4)" }}
                >
                  🥦 {plan.ingredients}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={onRegenerate}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#e2e8f0",
                borderRadius: "12px",
                padding: "10px 16px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            >
              <span>🔄</span>
              <span className="hidden sm:inline">別の献立を提案</span>
              <span className="sm:hidden">再生成</span>
            </button>

            <button
              onClick={handleCopy}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: copied ? "rgba(34,197,94,0.8)" : "linear-gradient(135deg, #4ade80, #16a34a)",
                border: "none",
                color: "#ffffff",
                borderRadius: "12px",
                padding: "10px 16px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: copied ? "0 2px 8px rgba(34,197,94,0.3)" : "0 2px 10px rgba(22,163,74,0.4)",
              }}
            >
              <span>{copied ? "✅" : "📋"}</span>
              <span className="hidden sm:inline">{copied ? "コピーしました！" : "献立をコピー"}</span>
              <span className="sm:hidden">{copied ? "完了" : "コピー"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 日程カード一覧 */}
      <div className="space-y-5">
        {days.map((day, index) => {
          const accent = DAY_ACCENTS[index % DAY_ACCENTS.length];
          return (
            <div
              key={day.dayNumber}
              className="animate-slide-up"
              style={{
                animationDelay: `${index * 0.1}s`,
                background: "#ffffff",
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(20,83,45,0.04), 0 10px 30px rgba(20,83,45,0.08)",
                border: "1px solid rgba(22,163,74,0.12)",
              }}
            >
              <div
                style={{
                  background: `linear-gradient(135deg, ${accent.from} 0%, ${accent.to} 100%)`,
                  padding: "16px 24px",
                  borderBottom: "2px solid rgba(74,222,128,0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(74,222,128,0.2)",
                    border: "2px solid rgba(74,222,128,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#86efac",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    flexShrink: 0,
                  }}
                >
                  {day.dayNumber}
                </span>
                <h3 style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.04em" }}>
                  Day {day.dayNumber}
                  <span style={{ marginLeft: "10px", fontSize: "0.7rem", fontWeight: 400, color: "#86efac", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {index + 1} / {days.length}
                  </span>
                </h3>
              </div>

              <div style={{ padding: "20px 24px 24px" }}>
                {renderDayContent(day.content)}
              </div>
            </div>
          );
        })}
      </div>

      {/* 買い物リスト */}
      {shoppingText && (
        <div
          className="mt-6 animate-slide-up"
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(20,83,45,0.04), 0 10px 30px rgba(20,83,45,0.08)",
            border: "1px solid rgba(22,163,74,0.2)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              padding: "16px 24px",
              borderBottom: "2px solid rgba(74,222,128,0.4)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>🛒</span>
            <h3 style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.1rem" }}>
              買い物リスト
            </h3>
          </div>
          <div style={{ padding: "20px 24px 24px" }}>
            {renderShoppingList(shoppingText)}
          </div>
        </div>
      )}

      {/* 下部ボタンエリア */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRegenerate}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            background: "linear-gradient(135deg, #14532d 0%, #15803d 100%)",
            color: "#ffffff",
            border: "1px solid rgba(74,222,128,0.3)",
            borderRadius: "14px",
            padding: "14px 32px",
            fontSize: "0.95rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(20,83,45,0.3)",
            transition: "all 0.2s",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(20,83,45,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(20,83,45,0.3)";
          }}
        >
          <span>🔄</span>
          別の献立を提案する
        </button>

        <button
          onClick={handleCopy}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            background: copied ? "#22c55e" : "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "14px",
            padding: "14px 32px",
            fontSize: "0.95rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: copied ? "0 4px 16px rgba(34,197,94,0.35)" : "0 4px 16px rgba(22,163,74,0.4)",
            transition: "all 0.2s",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(22,163,74,0.5)";
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(22,163,74,0.4)";
            }
          }}
        >
          <span>{copied ? "✅" : "📋"}</span>
          {copied ? "コピーしました！" : "献立をコピーする"}
        </button>
      </div>

      {/* 注意事項 */}
      <div
        className="mt-6"
        style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "14px",
          padding: "14px 18px",
        }}
      >
        <p className="text-sm flex items-start gap-2" style={{ color: "#14532d" }}>
          <span style={{ flexShrink: 0 }}>ℹ️</span>
          このプランはAIが生成した提案です。アレルギーや食事制限については必ずご自身でご確認ください。
        </p>
      </div>
    </div>
  );
}

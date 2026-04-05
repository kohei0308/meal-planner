import { useState } from "react";

const MEAL_STYLES = [
  { value: "japanese", label: "和食中心", icon: "🍱" },
  { value: "western", label: "洋食中心", icon: "🍝" },
  { value: "asian", label: "アジア料理", icon: "🍜" },
  { value: "balanced", label: "バランス型", icon: "⚖️" },
];

const S = {
  card: {
    background: "#ffffff",
    border: "1px solid rgba(22,163,74,0.15)",
    borderRadius: "20px",
    boxShadow:
      "0 4px 6px rgba(20,83,45,0.04), 0 10px 30px rgba(20,83,45,0.08)",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)",
    borderBottom: "1px solid rgba(74,222,128,0.3)",
  },
  label: {
    color: "#14532d",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "0.03em",
  },
  input: {
    background: "#f0fdf4",
    border: "1.5px solid #bbf7d0",
    borderRadius: "12px",
    color: "#1e293b",
    transition: "all 0.2s",
    outline: "none",
  },
  inputFocus: {
    border: "1.5px solid #16a34a",
    boxShadow: "0 0 0 3px rgba(22,163,74,0.18)",
  },
  selectBase: {
    background: "#f0fdf4",
    border: "1.5px solid #bbf7d0",
    borderRadius: "12px",
    color: "#1e293b",
    transition: "all 0.2s",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
  },
};

function CardButton({ selected, disabled, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        padding: "14px 8px",
        borderRadius: "14px",
        border: selected ? "2px solid #16a34a" : "2px solid #e2e8f0",
        background: selected
          ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
          : "#ffffff",
        color: selected ? "#15803d" : "#64748b",
        boxShadow: selected ? "0 2px 12px rgba(22,163,74,0.25)" : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s",
      }}
    >
      <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>{icon}</span>
      <span style={{ fontSize: "0.78rem", fontWeight: 700, textAlign: "center", lineHeight: 1.3 }}>
        {label}
      </span>
    </button>
  );
}

export default function MealForm({ onGenerate, loading, remaining, isLimitReached }) {
  const [ingredients, setIngredients] = useState("");
  const [days, setDays] = useState(3);
  const [people, setPeople] = useState(2);
  const [style, setStyle] = useState("balanced");
  const [allergies, setAllergies] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({ ingredients: ingredients.trim(), days, people, style, allergies: allergies.trim() });
  };

  const inputStyle = (name) => {
    if (focusedInput === name) return { ...S.input, ...S.inputFocus };
    return S.input;
  };

  const selectStyle = (name) => {
    if (focusedInput === name) return { ...S.selectBase, ...S.inputFocus };
    return S.selectBase;
  };

  return (
    <div style={S.card}>
      {/* フォームヘッダー */}
      <div style={S.header} className="px-6 py-5">
        <h2 className="font-bold text-lg flex items-center gap-3" style={{ color: "#fff" }}>
          <span
            className="flex items-center justify-center rounded-lg text-base"
            style={{
              background: "rgba(74,222,128,0.2)",
              border: "1px solid rgba(74,222,128,0.4)",
              width: "36px",
              height: "36px",
            }}
          >
            🥗
          </span>
          <span>
            献立の条件を設定する
            <span className="block text-xs font-normal mt-0.5" style={{ color: "#86efac" }}>
              条件を入力してAIが最適な献立を生成します
            </span>
          </span>
          <div style={{ marginLeft: "auto" }}>
            {isLimitReached ? (
              <span style={{ fontSize: "0.75rem", background: "#fee2e2", color: "#dc2626", padding: "4px 10px", borderRadius: "999px", fontWeight: 600 }}>
                今月の上限に達しました
              </span>
            ) : (
              <span style={{ fontSize: "0.75rem", background: "rgba(74,222,128,0.2)", color: "#86efac", padding: "4px 10px", borderRadius: "999px", fontWeight: 600 }}>
                残り {remaining} 回
              </span>
            )}
          </div>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-7">
        {/* 日数・人数 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2" style={S.label}>日数</label>
            <div className="relative">
              <span className="absolute text-base" style={{ left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                📅
              </span>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                onFocus={() => setFocusedInput("days")}
                onBlur={() => setFocusedInput(null)}
                style={{
                  ...selectStyle("days"),
                  width: "100%",
                  paddingLeft: "40px",
                  paddingRight: "32px",
                  paddingTop: "13px",
                  paddingBottom: "13px",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
                disabled={loading}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d} value={d}>{d}日分</option>
                ))}
              </select>
              <span className="absolute pointer-events-none" style={{ right: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "0.75rem" }}>
                ▼
              </span>
            </div>
          </div>

          <div>
            <label className="block mb-2" style={S.label}>人数</label>
            <div className="relative">
              <span className="absolute text-base" style={{ left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                👥
              </span>
              <select
                value={people}
                onChange={(e) => setPeople(Number(e.target.value))}
                onFocus={() => setFocusedInput("people")}
                onBlur={() => setFocusedInput(null)}
                style={{
                  ...selectStyle("people"),
                  width: "100%",
                  paddingLeft: "40px",
                  paddingRight: "32px",
                  paddingTop: "13px",
                  paddingBottom: "13px",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
                disabled={loading}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}名</option>
                ))}
              </select>
              <span className="absolute pointer-events-none" style={{ right: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "0.75rem" }}>
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* 食事スタイル */}
        <div>
          <label className="block mb-3" style={S.label}>食事スタイル</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {MEAL_STYLES.map((s) => (
              <CardButton
                key={s.value}
                selected={style === s.value}
                disabled={loading}
                onClick={() => setStyle(s.value)}
                icon={s.icon}
                label={s.label}
              />
            ))}
          </div>
        </div>

        {/* 使いたい食材 */}
        <div>
          <label className="block mb-2" style={S.label}>
            使いたい食材
            <span className="ml-2 text-xs font-normal" style={{ color: "#94a3b8" }}>
              （任意）
            </span>
          </label>
          <div className="relative">
            <span className="absolute text-lg" style={{ left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              🥦
            </span>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              onFocus={() => setFocusedInput("ingredients")}
              onBlur={() => setFocusedInput(null)}
              placeholder="例: 鶏肉、じゃがいも、玉ねぎ..."
              style={{
                ...inputStyle("ingredients"),
                width: "100%",
                paddingLeft: "44px",
                paddingRight: "16px",
                paddingTop: "13px",
                paddingBottom: "13px",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
              disabled={loading}
              maxLength={200}
            />
          </div>
        </div>

        {/* アレルギー・苦手食材 */}
        <div>
          <label className="block mb-2" style={S.label}>
            アレルギー・苦手食材
            <span className="ml-2 text-xs font-normal" style={{ color: "#94a3b8" }}>
              （任意）
            </span>
          </label>
          <div className="relative">
            <span className="absolute text-lg" style={{ left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              ⚠️
            </span>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              onFocus={() => setFocusedInput("allergies")}
              onBlur={() => setFocusedInput(null)}
              placeholder="例: えび、そば、ピーナッツ..."
              style={{
                ...inputStyle("allergies"),
                width: "100%",
                paddingLeft: "44px",
                paddingRight: "16px",
                paddingTop: "13px",
                paddingBottom: "13px",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
              disabled={loading}
              maxLength={200}
            />
          </div>
        </div>

        {/* 仕切り線 */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #bbf7d0, transparent)" }} />

        {/* 生成ボタン */}
        <button
          type="submit"
          disabled={loading || isLimitReached}
          style={
            loading || isLimitReached
              ? {
                  background: "#e2e8f0",
                  color: "#94a3b8",
                  cursor: "not-allowed",
                  border: "none",
                  borderRadius: "14px",
                  padding: "16px 24px",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }
              : {
                  background: "linear-gradient(135deg, #16a34a 0%, #15803d 50%, #14532d 100%)",
                  color: "#ffffff",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "14px",
                  padding: "16px 24px",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: "0 4px 20px rgba(22,163,74,0.4)",
                  transition: "all 0.2s",
                  letterSpacing: "0.03em",
                }
          }
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(22,163,74,0.5)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(22,163,74,0.4)";
            }
          }}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              AIが献立を生成中...
            </>
          ) : (
            <>
              <span style={{ fontSize: "1.2rem" }}>✨</span>
              献立プランを生成する
            </>
          )}
        </button>
      </form>
    </div>
  );
}

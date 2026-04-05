import { useState } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import MealForm from "./components/MealForm";
import MealPlan from "./components/MealPlan";
import { useUsageLimit } from "./hooks/useUsageLimit";

export default function App() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastConditions, setLastConditions] = useState(null);
  const { remaining, isLimitReached, incrementUsage } = useUsageLimit();

  const generatePlan = async (conditions) => {
    if (isLimitReached) {
      setError("今月の無料生成回数（3回）を使い切りました。来月またご利用ください。");
      return;
    }
    setLoading(true);
    setError(null);
    setPlan(null);
    setLastConditions(conditions);

    try {
      const response = await fetch("/api/generate-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conditions),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "献立の生成に失敗しました。");
      }

      setPlan(data);
      incrementUsage();
    } catch (err) {
      setError(
        err.message ||
          "予期せぬエラーが発生しました。しばらく待ってから再試行してください。"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastConditions) {
      generatePlan(lastConditions);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f0fdf4" }}>
      {/* ヒーローヘッダー */}
      <header
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #14532d 0%, #166534 35%, #15803d 65%, #14532d 100%)",
        }}
      >
        {/* 装飾ドット */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { top: "15%", left: "8%", size: "2px", opacity: 0.8 },
            { top: "25%", left: "18%", size: "1px", opacity: 0.5 },
            { top: "10%", left: "30%", size: "3px", opacity: 0.9 },
            { top: "40%", left: "5%", size: "1px", opacity: 0.6 },
            { top: "60%", left: "12%", size: "2px", opacity: 0.7 },
            { top: "20%", left: "75%", size: "2px", opacity: 0.8 },
            { top: "35%", left: "85%", size: "1px", opacity: 0.5 },
            { top: "55%", left: "92%", size: "3px", opacity: 0.9 },
            { top: "70%", left: "78%", size: "1px", opacity: 0.6 },
            { top: "80%", left: "88%", size: "2px", opacity: 0.7 },
          ].map((dot, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: dot.top,
                left: dot.left,
                width: dot.size,
                height: dot.size,
                opacity: dot.opacity,
              }}
            />
          ))}
          <div
            className="absolute rounded-full"
            style={{
              top: "-20%",
              right: "10%",
              width: "300px",
              height: "300px",
              background:
                "radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              bottom: "-30%",
              left: "15%",
              width: "250px",
              height: "250px",
              background:
                "radial-gradient(circle, rgba(22,163,74,0.2) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
            <div
              className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{
                background:
                  "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)",
              }}
            >
              🍽️
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(74,222,128,0.2)",
                    color: "#86efac",
                    border: "1px solid rgba(74,222,128,0.3)",
                  }}
                >
                  Meal Planner
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-white">
                AI献立プランナー
              </h1>
              <p
                className="text-sm md:text-base mt-2 max-w-lg"
                style={{ color: "#bbf7d0" }}
              >
                日数・人数・食事スタイルを選ぶだけで、
                <span style={{ color: "#4ade80" }}>あなただけの献立プラン</span>
                を自動生成します
              </p>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, #4ade80, transparent)",
          }}
        />
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        <MealForm onGenerate={generatePlan} loading={loading} remaining={remaining} isLimitReached={isLimitReached} />

        {loading && <LoadingSpinner />}

        {error && !loading && (
          <div className="mt-8 animate-fade-in">
            <div
              className="rounded-2xl p-5 flex items-start gap-4"
              style={{
                background: "#fff5f5",
                border: "1px solid #fed7d7",
              }}
            >
              <span className="text-red-400 text-2xl flex-shrink-0 mt-0.5">
                ⚠️
              </span>
              <div>
                <h3 className="font-bold text-red-700 mb-1 text-base">
                  エラーが発生しました
                </h3>
                <p className="text-red-600 text-sm">{error}</p>
                {lastConditions && (
                  <button
                    onClick={handleRegenerate}
                    className="mt-3 text-sm font-semibold underline"
                    style={{ color: "#c53030" }}
                  >
                    再試行する →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {plan && !loading && (
          <MealPlan plan={plan} onRegenerate={handleRegenerate} />
        )}
      </main>

      {/* フッター */}
      <footer
        className="mt-16 py-8"
        style={{
          background: "linear-gradient(135deg, #14532d 0%, #166534 100%)",
          borderTop: "1px solid rgba(74,222,128,0.2)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div
            className="flex items-center justify-center gap-2 mb-2"
            style={{ color: "#86efac" }}
          >
            <span style={{ color: "#4ade80" }}>✦</span>
            <p className="text-sm">AI献立プランナー</p>
            <span style={{ color: "#4ade80" }}>✦</span>
          </div>
          <p className="text-xs" style={{ color: "#6ee7b7" }}>
            生成された献立はAIによる提案です。アレルギーや健康上の注意事項は必ずご自身でご確認ください。
          </p>
        </div>
      </footer>
    </div>
  );
}

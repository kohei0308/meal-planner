export default function LoadingSpinner() {
  return (
    <div className="mt-8 animate-fade-in">
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          border: "1px solid rgba(22,163,74,0.15)",
          boxShadow: "0 4px 6px rgba(20,83,45,0.04), 0 10px 30px rgba(20,83,45,0.08)",
          padding: "48px 40px",
        }}
      >
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: "4px solid rgba(22,163,74,0.15)",
              }}
            />
            <div
              className="animate-spin"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: "4px solid transparent",
                borderTopColor: "#16a34a",
                borderRightColor: "rgba(22,163,74,0.3)",
              }}
            />
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "1.5rem",
              }}
            >
              🍽️
            </span>
          </div>

          <div className="text-center">
            <p className="font-bold text-lg" style={{ color: "#14532d" }}>
              献立プランを生成中...
            </p>
            <p className="text-sm mt-1" style={{ color: "#64748b" }}>
              最適なプランを考えています。しばらくお待ちください。
            </p>
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: "280px",
              background: "rgba(22,163,74,0.12)",
              borderRadius: "999px",
              height: "6px",
              overflow: "hidden",
            }}
          >
            <div
              className="animate-pulse"
              style={{
                height: "100%",
                width: "70%",
                background: "linear-gradient(90deg, #16a34a, #4ade80)",
                borderRadius: "999px",
              }}
            />
          </div>

          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "12px",
              padding: "10px 20px",
              fontSize: "0.875rem",
              color: "#14532d",
              textAlign: "center",
              maxWidth: "320px",
            }}
          >
            💡 生成には10〜30秒程度かかる場合があります
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { supabase } from "../supabase";

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("確認メールを送信しました。メールを確認してください。");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("メールアドレスまたはパスワードが間違っています。");
      } else {
        onClose();
      }
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#fff", borderRadius: "20px", padding: "36px",
          width: "100%", maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* ヘッダー */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#14532d", letterSpacing: "-.02em" }}>
              {mode === "login" ? "ログイン" : "新規登録"}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "2px" }}>
              {mode === "login" ? "アカウントにログイン" : "無料アカウントを作成"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#14532d", marginBottom: "6px" }}>
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              style={{
                width: "100%", padding: "12px 14px", borderRadius: "10px",
                border: "1.5px solid #bbf7d0", background: "#f0fdf4",
                fontSize: "0.95rem", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#14532d", marginBottom: "6px" }}>
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "6文字以上" : "パスワード"}
              required
              minLength={6}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: "10px",
                border: "1.5px solid #bbf7d0", background: "#f0fdf4",
                fontSize: "0.95rem", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: "10px", padding: "10px 14px", fontSize: "0.85rem", color: "#dc2626" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "10px 14px", fontSize: "0.85rem", color: "#15803d" }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#e2e8f0" : "linear-gradient(135deg, #16a34a, #15803d)",
              color: loading ? "#94a3b8" : "#fff",
              border: "none", borderRadius: "12px",
              padding: "14px", fontSize: "1rem", fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              boxShadow: loading ? "none" : "0 4px 16px rgba(22,163,74,0.4)",
            }}
          >
            {loading ? "処理中..." : mode === "login" ? "ログイン" : "登録する"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.875rem", color: "#64748b" }}>
          {mode === "login" ? (
            <>アカウントをお持ちでない方は{" "}
              <button onClick={() => { setMode("signup"); setError(null); }} style={{ background: "none", border: "none", color: "#16a34a", fontWeight: 700, cursor: "pointer", fontSize: "inherit" }}>
                新規登録
              </button>
            </>
          ) : (
            <>すでにアカウントをお持ちの方は{" "}
              <button onClick={() => { setMode("login"); setError(null); }} style={{ background: "none", border: "none", color: "#16a34a", fontWeight: 700, cursor: "pointer", fontSize: "inherit" }}>
                ログイン
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

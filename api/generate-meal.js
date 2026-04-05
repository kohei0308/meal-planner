import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const styleLabels = {
  japanese: "和食中心",
  western: "洋食中心",
  asian: "アジア料理中心",
  balanced: "バランス型",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ingredients, days, people, style, allergies } = req.body;

  const daysNum = parseInt(days, 10);
  const peopleNum = parseInt(people, 10);

  if (isNaN(daysNum) || daysNum < 1 || daysNum > 7) {
    return res.status(400).json({ error: "日数は1〜7日の範囲で指定してください。" });
  }
  if (isNaN(peopleNum) || peopleNum < 1 || peopleNum > 10) {
    return res.status(400).json({ error: "人数は1〜10名の範囲で指定してください。" });
  }
  if (ingredients && ingredients.length > 200) {
    return res.status(400).json({ error: "食材は200文字以内で入力してください。" });
  }
  if (allergies && allergies.length > 200) {
    return res.status(400).json({ error: "アレルギー・苦手食材は200文字以内で入力してください。" });
  }

  const styleLabel = styleLabels[style] || "バランス型";

  const ingredientsPart = ingredients && ingredients.trim()
    ? `- 使いたい食材: ${ingredients.trim()}`
    : "- 使いたい食材: 特になし（旬の食材・定番食材でOK）";

  const allergiesPart = allergies && allergies.trim()
    ? `- アレルギー・苦手食材: ${allergies.trim()}`
    : "- アレルギー・苦手食材: なし";

  const prompt = `あなたはプロの栄養士・料理家です。以下の条件で献立プランを作成してください。

【条件】
- 日数: ${daysNum}日分
- 人数: ${peopleNum}名
- 食事スタイル: ${styleLabel}
${ingredientsPart}
${allergiesPart}

【出力形式】
必ず以下の形式で、${daysNum}日分の献立プランを作成してください。各日は「## Day X」の見出しで始めてください。

## Day 1

**朝食**
- 料理名: [料理名]
- 材料: [主な材料]
- ポイント: [調理のコツや栄養ポイント]

**昼食**
- 料理名: [料理名]
- 材料: [主な材料]
- ポイント: [調理のコツや栄養ポイント]

**夕食**
- 料理名: [料理名]
- 材料: [主な材料]
- ポイント: [調理のコツや栄養ポイント]

**この日のポイント**: [栄養バランスや調理効率のまとめ]

---

（Day 2以降も同じ形式で続ける）

【最後に買い物リストを追加】
## 買い物リスト

**野菜・果物**
- [食材名]

**肉・魚**
- [食材名]

**その他**
- [食材名]

【注意事項】
- ${styleLabel}に合わせた料理を提案してください
- ${peopleNum}名分の献立を提案してください
- ${allergiesPart.replace("- ", "")}を必ず避けてください
- 栄養バランスを考慮してください
- できるだけ作り置きや使い回しを活用した効率的な献立にしてください
- 日本語で回答してください
- 各日程の最後に「---」区切り線を入れてください`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: Math.min(daysNum * 900 + 1200, 4096),
      messages: [{ role: "user", content: prompt }],
    });

    const planText =
      message.content[0].type === "text" ? message.content[0].text : "";

    res.json({ plan: planText, days: daysNum, people: peopleNum, style: styleLabel, ingredients, allergies });
  } catch (error) {
    if (error.status === 401) {
      res.status(500).json({ error: "APIキーが無効です。" });
    } else if (error.status === 429) {
      res.status(429).json({ error: "APIのリクエスト制限に達しました。しばらく待ってから再試行してください。" });
    } else {
      res.status(500).json({ error: "献立プランの生成中にエラーが発生しました。しばらく待ってから再試行してください。" });
    }
  }
}

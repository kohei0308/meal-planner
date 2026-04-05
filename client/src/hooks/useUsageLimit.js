import { useState } from "react";

const STORAGE_KEY = "meal_planner_usage";
const MAX_FREE_USES = 3;

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
}

function getUsageData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { month: getCurrentMonth(), count: 0 };
    const data = JSON.parse(raw);
    if (data.month !== getCurrentMonth()) {
      return { month: getCurrentMonth(), count: 0 };
    }
    return data;
  } catch {
    return { month: getCurrentMonth(), count: 0 };
  }
}

export function useUsageLimit() {
  const [usageData, setUsageData] = useState(getUsageData);

  const remaining = Math.max(0, MAX_FREE_USES - usageData.count);
  const isLimitReached = usageData.count >= MAX_FREE_USES;

  const incrementUsage = () => {
    const newData = { month: getCurrentMonth(), count: usageData.count + 1 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    setUsageData(newData);
  };

  return { remaining, isLimitReached, incrementUsage, maxUses: MAX_FREE_USES };
}

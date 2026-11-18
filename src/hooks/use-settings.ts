import { useCallback, useEffect, useState } from "react";

import type { EmailTone } from "@/lib/ai/prompts";

export type AppSettings = { displayName: string; defaultTone: EmailTone };

const KEY = "wpa:settings";
export const DEFAULT_SETTINGS: AppSettings = { displayName: "", defaultTone: "formal" };

function read(): AppSettings {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Temporary preferences kept in this browser only. */
export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSettings(read());
    setLoaded(true);
  }, []);

  const save = useCallback((next: AppSettings) => {
    setSettings(next);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    window.localStorage.removeItem(KEY);
  }, []);

  return { settings, save, reset, loaded };
}

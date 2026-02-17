"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { LanguageMode } from "@/types";

// 언어와 선택된 프로젝트 id만 간단하게 관리
type AppStateContextValue = {
  language: LanguageMode;
  selectedProjectId: number | null;
  setLanguage: (language: LanguageMode) => void;
  setSelectedProjectId: (projectId: number | null) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

type AppStateProviderProps = {
  children: ReactNode;
};

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [language, setLanguage] = useState<LanguageMode>("ko"); //디폴트는 국문
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );

  const handleSetLanguage = useCallback((next: LanguageMode) => {
    setLanguage(next);
  }, []);

  const handleSetSelectedProjectId = useCallback((projectId: number | null) => {
    setSelectedProjectId(projectId);
  }, []);

  const value = useMemo(
    () => ({
      language,
      selectedProjectId,
      setLanguage: handleSetLanguage,
      setSelectedProjectId: handleSetSelectedProjectId,
    }),
    [
      language,
      selectedProjectId,
      handleSetLanguage,
      handleSetSelectedProjectId,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return context;
}

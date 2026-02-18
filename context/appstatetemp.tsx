"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ViewMode, LanguageMode } from "@/types";

/**
 * 앱 전역에서 사용할 간단한 상태 관리 컨텍스트
 * - selectedProjectId: 현재 선택된 프로젝트 id or null
 * - language: 현재 언어 모드 ("ko" 또는 "en")
 * - viewMode: 게시글 목록의 뷰 모드 ("grid" 또는 "list")
 */
interface AppState {
  selectedProjectId: number | null;
  language: LanguageMode;
  viewMode: ViewMode;
}

interface AppContextType extends AppState {
  selectProject: (id: number | null) => void;

  setLanguage: (lang: LanguageMode) => void;
  toggleLanguage: () => void;

  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
}

const AppStateContext = createContext<AppContextType | undefined>(undefined);

interface AppStateProviderProps {
  children: ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [state, setState] = useState<AppState>({
    selectedProjectId: null,
    language: "ko",
    viewMode: "grid",
  });

  const selectProject = (id: number | null) => {
    setState((prev) => ({ ...prev, selectedProjectId: id }));
  };

  const setLanguage = (language: LanguageMode) => {
    setState((prev) => ({ ...prev, language }));
  };

  const toggleLanguage = () => {
    setState((prev) => ({
      ...prev,
      language: prev.language === "ko" ? "en" : "ko",
    }));
  };

  const setViewMode = (viewMode: ViewMode) => {
    setState((prev) => ({ ...prev, viewMode }));
  };

  const toggleViewMode = () => {
    setState((prev) => ({
      ...prev,
      viewMode: prev.viewMode === "list" ? "grid" : "list",
    }));
  };

  const value: AppContextType = {
    ...state,
    selectProject,
    setLanguage,
    toggleLanguage,
    setViewMode,
    toggleViewMode,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}

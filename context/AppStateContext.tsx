"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { LanguageMode, SidebarSlug, ViewMode } from "@/types";

type SidebarMode =
  | { mode: "page"; slug: SidebarSlug }
  | { mode: "project"; projectId: number };

// 언어와 사이드바 상태 관리
type AppStateContextValue = {
  language: LanguageMode;
  selectedProjectId: number | null;
  activeSlug: SidebarSlug | null;
  viewMode: ViewMode;
  setLanguage: (language: LanguageMode) => void;
  selectProject: (projectId: number) => void;
  selectPage: (slug: SidebarSlug) => void;
  setViewMode: (mode: ViewMode) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

type AppStateProviderProps = {
  children: ReactNode;
};

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [language, setLanguage] = useState<LanguageMode>("ko"); //디폴트는 국문
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>({
    mode: "page",
    slug: "cv",
  });
  const [viewMode, setViewMode] = useState<ViewMode>("grid"); //디폴트는 그리드 뷰

  const handleSetLanguage = useCallback((next: LanguageMode) => {
    setLanguage(next);
  }, []);

  const selectProject = useCallback((projectId: number) => {
    setSidebarMode({ mode: "project", projectId });
  }, []);

  const selectPage = useCallback((slug: SidebarSlug) => {
    setSidebarMode({ mode: "page", slug });
  }, []);

  const selectedProjectId =
    sidebarMode.mode === "project" ? sidebarMode.projectId : null;
  const activeSlug = sidebarMode.mode === "page" ? sidebarMode.slug : null;

  const value = useMemo(
    () => ({
      language,
      selectedProjectId,
      activeSlug,
      setLanguage: handleSetLanguage,
      selectProject,
      selectPage,
      viewMode,
      setViewMode,
    }),
    [
      language,
      selectedProjectId,
      activeSlug,
      handleSetLanguage,
      selectProject,
      selectPage,
      viewMode,
      setViewMode,
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

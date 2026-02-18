"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// 모바일용 사이드바 상태 관리 context
type SidebarDirection = "horizontal" | "vertical";

interface SidebarState {
  isOpen: boolean;
  direction: SidebarDirection;
}

interface SidebarContextType {
  isOpen: boolean;
  direction: SidebarDirection;
  toggleSidebar: () => void;
  setDirection: (direction: SidebarDirection) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
  defaultOpen?: boolean;
  defaultDirection?: SidebarDirection;
}

export function SidebarProvider({
  children,
  defaultOpen = false,
  defaultDirection = "horizontal",
}: SidebarProviderProps) {
  const [state, setState] = useState<SidebarState>({
    isOpen: defaultOpen,
    direction: defaultDirection,
  });

  // Desktop 크기(1024px 이상)에서는 무조건 열린 상태로 강제
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        // Desktop 크기: 무조건 열린 상태로 강제
        setState((prev) => ({ ...prev, isOpen: true }));
      }
      // 작아지면 자동 변경 없이 현재 상태 유지 (사용자가 직접 제어)
    };

    // 초기 실행
    if (mediaQuery.matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState((prev) => ({ ...prev, isOpen: true }));
    }

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const toggleSidebar = () => {
    // Desktop에서는 토글 무시
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) return;

    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const setDirection = (direction: SidebarDirection) => {
    setState((prev) => ({ ...prev, direction }));
  };

  const value: SidebarContextType = {
    isOpen: state.isOpen,
    direction: state.direction,
    toggleSidebar,
    setDirection,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

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
  isMobile: boolean;
}

interface SidebarContextType {
  isOpen: boolean;
  direction: SidebarDirection;
  isMobile: boolean;
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
    isMobile: false, // 초기값, useEffect에서 실제 값 설정
  });

  // Desktop/Mobile 감지 및 사이드바 상태 관리
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      const isDesktop = e.matches;
      setState((prev) => ({
        ...prev,
        isMobile: !isDesktop,
        isOpen: isDesktop ? true : prev.isOpen, // Desktop에서는 무조건 열림
      }));
    };

    // 초기 실행
    const isDesktop = mediaQuery.matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => ({
      ...prev,
      isMobile: !isDesktop,
      isOpen: isDesktop ? true : prev.isOpen,
    }));

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const toggleSidebar = () => {
    // Mobile에서만 토글 가능
    if (!state.isMobile) return;

    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const setDirection = (direction: SidebarDirection) => {
    setState((prev) => ({ ...prev, direction }));
  };

  const value: SidebarContextType = {
    isOpen: state.isOpen,
    direction: state.direction,
    isMobile: state.isMobile,
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

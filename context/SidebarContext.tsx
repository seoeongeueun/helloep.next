"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface SidebarState {
  isOpen: boolean;
  isMobile: boolean;
}

interface SidebarContextType {
  isOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({
  children,
  defaultOpen = false,
}: SidebarProviderProps) {
  const [state, setState] = useState<SidebarState>({
    isOpen: defaultOpen,
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
        isOpen: isDesktop ? true : false, // Desktop에서는 무조건 열림, Mobile에서는 무조건 닫힘
      }));
    };

    // 초기 실행
    const isDesktop = mediaQuery.matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => ({
      ...prev,
      isMobile: !isDesktop,
      isOpen: isDesktop ? true : defaultOpen, // Desktop에서는 무조건 열림, Mobile에서는 defaultOpen 사용
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

  const closeSidebar = () => {
    if (!state.isMobile) return;

    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const openSidebar = () => {
    if (!state.isMobile) return;

    setState((prev) => ({ ...prev, isOpen: true }));
  };

  const value: SidebarContextType = {
    isOpen: state.isOpen,
    isMobile: state.isMobile,
    toggleSidebar,
    closeSidebar,
    openSidebar,
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

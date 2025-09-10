"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalStateContextType {
  selectedSessions: string[];
  setSelectedSessions: (sessions: string[]) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

interface GlobalStateProviderProps {
  children: ReactNode;
}

export function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  const value: GlobalStateContextType = {
    selectedSessions,
    setSelectedSessions,
  };

  return <GlobalStateContext.Provider value={value}>{children}</GlobalStateContext.Provider>;
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
}

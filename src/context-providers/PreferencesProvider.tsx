import React, { createContext, ReactNode } from "react";
import { Filter } from "./FilterProvider";
import { useLocalStorage } from "@rehooks/local-storage";

type FilterPreferences = {
  [title: string]: Filter[];
};

type PreferencesContextType = {
  filterPreferences: FilterPreferences;
  setFilterPreferences: (filterPreferences: FilterPreferences) => void;
};

export const PreferencesContext = createContext<PreferencesContextType>({
  filterPreferences: {},
  setFilterPreferences: (filterPreferences: FilterPreferences) => {},
});

function PreferencesProvider({ children }: { children: ReactNode }) {
  const [filterPreferences, setFilterPreferences] = useLocalStorage<
    FilterPreferences
  >("filter preferences", {});

  return (
    <PreferencesContext.Provider
      value={{ filterPreferences, setFilterPreferences }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export default PreferencesProvider;

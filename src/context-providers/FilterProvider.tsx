import React, { createContext, useState } from "react";

export type EqualValue = {
  content: string;
  partialValueSearch: boolean;
  caseSensitiveValueSearch: boolean;
};

export type RangeValue = {
  bounds: { lowerBound?: string; upperBound?: string };
};

export type SearchTerm = {
  keyPath: string[];
  value: EqualValue | RangeValue;
  isRangeValue: boolean;
};

export type Filter = {
  searchGroup: string[];
  searchTerms: SearchTerm[];
};

type FileFilter = {
  [filename: string]: Filter[];
};

type FilterContextType = {
  getFilters: (filename: string) => Filter[];
  updateFilters: (filename: string, filters: Filter[]) => void;
};

export const FilterContext = createContext<FilterContextType>({
  getFilters: (filename: string) => [],
  updateFilters: (filename: string, filters: Filter[]) => {},
});

function FilterProvider(props: any) {
  const [file, setFile] = useState<FileFilter>({});

  console.log(file);

  return (
    <FilterContext.Provider
      value={{
        getFilters: (filename: string) => file[filename] ?? [],
        updateFilters: (filename: string, filters: Filter[]) => {
          setFile({ ...file, [filename]: filters });
        },
      }}
    >
      {props.children}
    </FilterContext.Provider>
  );
}

export default FilterProvider;

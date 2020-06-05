import React, { createContext, useState } from "react";

export type SearchTerm = {
  keyPath: string[];
  value: any;
  partialValueSearch: boolean;
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

import React, { createContext, useState } from "react";

export type SearchTerm = {
  keyPath: string;
  value: any;
  partialValueSearch: boolean;
};

export type Filter = {
  searchGroup: string;
  searchTerms: SearchTerm[];
};

type FileFilter = {
  [filename: string]: Filter[];
};

type FilterContextType = {
  file: FileFilter;
  updateFilters: (filename: string, filters: Filter[]) => void;
};

export const FilterContext = createContext<FilterContextType>({
  file: {},
  updateFilters: (filename: string, filters: Filter[]) => {},
});

function FilterProvider(props: any) {
  const [file, setFile] = useState<FileFilter>({});

  console.log(file);

  return (
    <FilterContext.Provider
      value={{
        file: file,
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

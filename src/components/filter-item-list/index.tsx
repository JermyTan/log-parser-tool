import React from "react";
import { Divider, Segment } from "semantic-ui-react";
import FilterItem from "../filter-item";
import { Filter, SearchTerm } from "../../context-providers/FilterProvider";
import "./index.scss";

export type FilterActions = {
  removeFilter: (filterIndex: number) => void;
  setSearchGroup: (filterIndex: number, newSearchGroup: string) => void;
  addSearchTerm: (filterIndex: number, searchTerm: SearchTerm) => void;
  removeSearchTerm: (filterIndex: number, searchTermIndex: number) => void;
};

type Props = {
  filters: Filter[];
  filterActions: FilterActions;
};

function FilterItemList({ filters, filterActions }: Props) {
  const list = filters.flatMap((filter, index) => [
    <FilterItem
      key={index * 2}
      filter={filter}
      filterIndex={index}
      filterActions={filterActions}
    />,
    <Divider key={index * 2 + 1} horizontal content="OR" />,
  ]);
  list.pop();

  return (
    <div className="filter-item-list-container">
      {list.length > 0 ? (
        list
      ) : (
        <Segment
          placeholder
          basic
          textAlign="center"
          content={<h3>There are currently no filters</h3>}
        />
      )}
    </div>
  );
}

export default FilterItemList;

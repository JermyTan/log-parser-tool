import React from "react";
import { SearchTerm } from "../../context-providers/FilterProvider";
import SearchTermItem from "../search-term-item";
import "./index.scss";
import { Segment } from "semantic-ui-react";

type Props = {
  searchTerms: SearchTerm[];
  filterIndex: number;
  searchGroup: string[];
  removeSearchTerm: (filterIndex: number, searchTermIndex: number) => void;
};

function SearchTermItemList({
  searchTerms,
  filterIndex,
  searchGroup,
  removeSearchTerm,
}: Props) {
  const list = searchTerms.flatMap((searchTerm, index) => [
    <SearchTermItem
      key={index * 2}
      searchTerm={searchTerm}
      filterIndex={filterIndex}
      searchTermIndex={index}
      removeSearchTerm={removeSearchTerm}
      searchGroup={searchGroup}
    />,
    <div className="and-separator" key={index * 2 + 1}>
      AND
    </div>,
  ]);
  list.pop();

  return (
    <Segment className="search-terms-list-container" textAlign="center" compact>
      {list.length > 0 ? (
        <div className="search-terms-container">{list}</div>
      ) : (
        <h4>There are currently no filter conditions</h4>
      )}
    </Segment>
  );
}

export default SearchTermItemList;

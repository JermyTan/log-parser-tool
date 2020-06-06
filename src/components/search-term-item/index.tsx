import React from "react";
import { Label, Icon } from "semantic-ui-react";
import { SearchTerm } from "../../context-providers/FilterProvider";
import "./index.scss";

type Props = {
  removeSearchTerm: (filterIndex: number, searchTermIndex: number) => void;
  filterIndex: number;
  searchTermIndex: number;
  searchTerm: SearchTerm;
  searchGroup: string[];
};

function SearchTermItem({
  searchTerm,
  filterIndex,
  searchTermIndex,
  removeSearchTerm,
  searchGroup,
}: Props) {
  const {
    keyPath,
    value,
    partialValueSearch,
    caseSensitiveValueSearch,
  } = searchTerm;

  const lhs = ["root", searchGroup.join("."), keyPath.join(".")];
  searchGroup.length === 0 && lhs.splice(1, 1);

  return (
    <Label
      className="search-term-item"
      color={partialValueSearch ? "brown" : "grey"}
      basic={caseSensitiveValueSearch}
    >
      {lhs.join(".")} == {value}
      <Icon
        name="close"
        onClick={() => removeSearchTerm(filterIndex, searchTermIndex)}
        link
      />
    </Label>
  );
}

export default SearchTermItem;

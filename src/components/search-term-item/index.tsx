import React from "react";
import { Label, Icon } from "semantic-ui-react";
import {
  SearchTerm,
  EqualValue,
  RangeValue,
} from "../../context-providers/FilterProvider";
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
  const { keyPath, value, isRangeValue } = searchTerm;
  const {
    caseSensitiveValueSearch,
    partialValueSearch,
    content,
  } = value as EqualValue;
  const { bounds } = value as RangeValue;
  const { lowerBound, upperBound } = { ...bounds };

  const pathString = ["root"].concat(searchGroup).concat(keyPath).join(".");

  return (
    <Label
      className="search-term-item"
      color={
        isRangeValue ? "violet" : caseSensitiveValueSearch ? "brown" : "grey"
      }
      basic={!isRangeValue && partialValueSearch}
    >
      {isRangeValue
        ? `${lowerBound ? `${lowerBound} ≤ ` : ""}${pathString}${
            upperBound ? ` ≤ ${upperBound}` : ""
          }`
        : `${pathString} == ${content}`}
      <Icon
        name="close"
        onClick={() => removeSearchTerm(filterIndex, searchTermIndex)}
        link
      />
    </Label>
  );
}

export default SearchTermItem;

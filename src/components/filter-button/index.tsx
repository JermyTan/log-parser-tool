import React, { useState, useContext } from "react";
import { Button, Modal, Popup } from "semantic-ui-react";
import {
  FilterContext,
  Filter,
  SearchTerm,
} from "../../context-providers/FilterProvider";
import FilterItemList from "../filter-item-list";
import FilterUsageButton from "../filter-usage-button";
import MoreFilterActionsButton from "../more-filter-actions-button";
import "./index.scss";

type Props = {
  filename: string;
  applyFilter: () => void;
};

function FilterButton({ filename, applyFilter }: Props) {
  const { getFilters, updateFilters } = useContext(FilterContext);
  const [openFilterOptions, setOpenFilterOptions] = useState(false);
  const [filters, setFilters] = useState<Filter[]>([]);
  const filteredResults = filters.filter(
    (filter) => filter.searchGroup.length > 0 || filter.searchTerms.length > 0
  );

  const addFilter = (filter: Filter = { searchGroup: [], searchTerms: [] }) => {
    setFilters(filters.concat(filter));
  };

  const removeFilter = (filterIndex: number) => {
    const filtersCopy = [...filters];
    filtersCopy.splice(filterIndex, 1);
    setFilters(filtersCopy);
  };

  const setSearchGroup = (filterIndex: number, newSearchGroup: string) => {
    const changedFilter = filters[filterIndex];
    const changedFilterCopy: Filter = {
      ...changedFilter,
      searchGroup: newSearchGroup ? newSearchGroup.split(".") : [],
    };

    const filtersCopy = [...filters];
    filtersCopy[filterIndex] = changedFilterCopy;
    setFilters(filtersCopy);
  };

  const addSearchTerm = (filterIndex: number, searchTerm: SearchTerm) => {
    const changedFilter = filters[filterIndex];
    const changedFilterCopy: Filter = {
      ...changedFilter,
      searchTerms: changedFilter.searchTerms.concat(searchTerm),
    };

    const filtersCopy = [...filters];
    filtersCopy[filterIndex] = changedFilterCopy;
    setFilters(filtersCopy);
  };

  const removeSearchTerm = (filterIndex: number, searchTermIndex: number) => {
    const changedFilter = filters[filterIndex];
    const searchTermsCopy = [...changedFilter.searchTerms];
    searchTermsCopy.splice(searchTermIndex, 1);
    const changedFilterCopy: Filter = {
      ...changedFilter,
      searchTerms: searchTermsCopy,
    };

    const filtersCopy = [...filters];
    filtersCopy[filterIndex] = changedFilterCopy;
    setFilters(filtersCopy);
  };

  const handleApply = () => {
    updateFilters(filename, filteredResults);
    applyFilter();
    setOpenFilterOptions(false);
  };

  return (
    <Modal
      trigger={
        <Popup
          content="Filter"
          trigger={
            <Button
              icon="filter"
              primary
              onClick={() => setOpenFilterOptions(true)}
            />
          }
          position="top center"
        />
      }
      open={openFilterOptions}
      onOpen={() => setFilters(getFilters(filename))}
      onClose={() => setOpenFilterOptions(false)}
      size="large"
    >
      <Modal.Header className="filter-options-header">
        <span>
          Filter Options <FilterUsageButton />
        </span>

        <span>
          <MoreFilterActionsButton
            currentFilters={filteredResults}
            setCurrentFilters={setFilters}
          />
          <Popup
            content="Add filter"
            trigger={
              <Button color="green" icon="plus" onClick={() => addFilter()} />
            }
            position="top center"
            on="hover"
          />
        </span>
      </Modal.Header>

      <Modal.Content scrolling>
        <FilterItemList
          filters={filters}
          filterActions={{
            removeFilter: removeFilter,
            setSearchGroup: setSearchGroup,
            addSearchTerm: addSearchTerm,
            removeSearchTerm: removeSearchTerm,
          }}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button content="Back" onClick={() => setOpenFilterOptions(false)} />
        <Button primary content="Apply" onClick={handleApply} />
      </Modal.Actions>
    </Modal>
  );
}

export default FilterButton;

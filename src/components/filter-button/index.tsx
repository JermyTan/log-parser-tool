import React, { useState, useContext } from "react";
import { Button, Modal, Popup } from "semantic-ui-react";
import {
  FilterContext,
  Filter,
  SearchTerm,
} from "../../context-providers/FilterProvider";
import FilterItemList from "../filter-item-list";
import FilterUsageSection from "../filter-usage-section";
import "./index.scss";

type Props = {
  filename: string;
  applyFilter: () => void;
};

function FilterButton({ filename, applyFilter }: Props) {
  const { getFilters, updateFilters } = useContext(FilterContext);
  const [openFilterOptions, setOpenFilterOptions] = useState(false);
  const [openFilterUsage, setOpenFilterUsage] = useState(false);
  const [filters, setFilters] = useState<Filter[]>([]);

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
    const filteredResults = filters.filter(
      (filter) => filter.searchGroup.length > 0 || filter.searchTerms.length > 0
    );
    updateFilters(filename, filteredResults);
    applyFilter();
    setOpenFilterUsage(false);
    setOpenFilterOptions(false);
  };

  return (
    <Modal
      trigger={
        <Button
          content="Filter"
          primary
          compact
          onClick={() => setOpenFilterOptions(true)}
        />
      }
      open={openFilterOptions}
      onOpen={() => setFilters(getFilters(filename))}
      onClose={() => {
        setOpenFilterUsage(false);
        setOpenFilterOptions(false);
      }}
    >
      <Modal.Header className="filter-options-header">
        <span>
          Filter Options{" "}
          <Button
            className="filter-usage-button"
            content="Usage"
            color="teal"
            onClick={() => setOpenFilterUsage(!openFilterUsage)}
          />
        </span>

        <span>
          <Popup
            content="Add filter"
            trigger={
              <Button color="green" icon="plus" onClick={() => addFilter()} />
            }
            position="top center"
          />
        </span>
      </Modal.Header>

      <FilterUsageSection openFilterUsage={openFilterUsage} />

      <Modal.Content>
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
        <Button
          content="Back"
          onClick={() => {
            setOpenFilterUsage(false);
            setOpenFilterOptions(false);
          }}
        />
        <Button primary content="Apply" onClick={handleApply} />
      </Modal.Actions>
    </Modal>
  );
}

export default FilterButton;

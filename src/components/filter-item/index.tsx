import React, { useState } from "react";
import { Form, Popup, Label, Tab } from "semantic-ui-react";
import { Filter } from "../../context-providers/FilterProvider";
import { FilterActions } from "../filter-item-list";
import SearchTermItemList from "../search-term-item-list";
import FilterItemInputField from "../filter-item-input-field";
import FilterItemDatetimeInputField from "../filter-item-datetime-input-field";
import { parseStringToDate } from "../../utils/types-util";
import "./index.scss";
import "react-datetime/css/react-datetime.css";

type Props = {
  filter: Filter;
  filterIndex: number;
  filterActions: FilterActions;
};

function FilterItem({ filter, filterIndex, filterActions }: Props) {
  const {
    removeFilter,
    setSearchGroup,
    addSearchTerm,
    removeSearchTerm,
  } = filterActions;
  const { searchGroup, searchTerms } = filter;
  const [keyPath, setKeyPath] = useState("");
  const [value, setValue] = useState("");
  const [partialValueSearch, setPartialValueSearch] = useState(false);
  const [caseSensitiveValueSearch, setCaseSensitiveValueSearch] = useState(
    false
  );
  const [isRangeValue, setRangeValue] = useState(false);
  const [lowerBound, setLowerBound] = useState("");
  const [upperBound, setUpperBound] = useState("");
  const trimmedLowerBound = lowerBound.trim();
  const trimmedUpperBound = upperBound.trim();
  const isLowerBoundDatetime = parseStringToDate(trimmedLowerBound).isValidDate;
  const isUpperBoundDateTime = parseStringToDate(trimmedUpperBound).isValidDate;

  const panes = [
    {
      menuItem: "Equality Filter",
      render: () => (
        <Tab.Pane attached={false}>
          <Form.Group className="filter-item-inputs-container">
            <FilterItemInputField
              fieldLabel="Key Path"
              inputLabel={{
                content: `root.${searchGroup.join(".")}${
                  searchGroup.length > 0 ? "." : ""
                }`,
              }}
              placeholder="action.type"
              value={keyPath}
              onChange={(event, data) => setKeyPath(data.value.trim())}
              onClear={() => setKeyPath("")}
            />

            <div className="filter-item-equals-container">
              <Label className="filter-item-comparison-symbol" content="==" />
            </div>

            <FilterItemInputField
              fieldLabel="Value"
              placeholder="NETWORK_WEB_SOCKET_CONNECTING"
              value={value}
              onChange={(event, data) => setValue(data.value)}
              onClear={() => setValue("")}
            />
          </Form.Group>

          <Form.Group className="filter-item-actions-container">
            <Form.Button
              className="filter-item-action"
              content="Add"
              onClick={() => {
                addSearchTerm(filterIndex, {
                  keyPath: keyPath.split("."),
                  value: {
                    content: value.trim(),
                    partialValueSearch,
                    caseSensitiveValueSearch,
                  },
                  isRangeValue: isRangeValue,
                });
                setValue("");
              }}
              compact
              primary
              disabled={!keyPath || !value.trim()}
            />

            <Form.Radio
              className="filter-item-action"
              label="Allow partial value search"
              toggle
              checked={partialValueSearch}
              onChange={() => setPartialValueSearch(!partialValueSearch)}
            />

            <Form.Radio
              className="filter-item-action"
              label="Allow case-sensitive value search"
              toggle
              checked={caseSensitiveValueSearch}
              onChange={() =>
                setCaseSensitiveValueSearch(!caseSensitiveValueSearch)
              }
            />
          </Form.Group>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Range Filter",
      render: () => (
        <Tab.Pane attached={false}>
          <Form.Group className="filter-item-inputs-container">
            <FilterItemDatetimeInputField
              inputLabel={
                isLowerBoundDatetime
                  ? {
                      icon: { name: "calendar check outline", fitted: true },
                      color: "teal",
                    }
                  : undefined
              }
              fieldLabel="Lower Bound Value"
              value={lowerBound}
              onChange={setLowerBound}
            />

            <div className="filter-item-equals-container">
              <Label className="filter-item-comparison-symbol" content="≤" />
            </div>

            <FilterItemInputField
              fieldLabel="Key Path"
              inputLabel={{
                content: `root.${searchGroup.join(".")}${
                  searchGroup.length > 0 ? "." : ""
                }`,
              }}
              placeholder="action.type"
              value={keyPath}
              onChange={(event, data) => setKeyPath(data.value.trim())}
              onClear={() => setKeyPath("")}
            />

            <div className="filter-item-equals-container">
              <Label className="filter-item-comparison-symbol" content="≤" />
            </div>

            <FilterItemDatetimeInputField
              inputLabel={
                isUpperBoundDateTime
                  ? {
                      icon: { name: "calendar check outline", fitted: true },
                      color: "teal",
                    }
                  : undefined
              }
              fieldLabel="Upper Bound Value"
              value={upperBound}
              onChange={setUpperBound}
            />
          </Form.Group>

          <Form.Group className="filter-item-actions-container">
            <Form.Button
              className="filter-item-action"
              content="Add"
              onClick={() => {
                addSearchTerm(filterIndex, {
                  keyPath: keyPath.split("."),
                  value: {
                    bounds: {
                      lowerBound: !trimmedLowerBound
                        ? undefined
                        : trimmedLowerBound,
                      upperBound: !trimmedUpperBound
                        ? undefined
                        : trimmedUpperBound,
                    },
                  },
                  isRangeValue: isRangeValue,
                });
                setLowerBound("");
                setUpperBound("");
              }}
              compact
              primary
              disabled={
                !keyPath ||
                (!trimmedLowerBound && !trimmedUpperBound) ||
                (!!trimmedLowerBound &&
                !!trimmedUpperBound &&
                isLowerBoundDatetime
                  ? !isUpperBoundDateTime
                  : isUpperBoundDateTime)
              }
            />
          </Form.Group>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Form>
      <Form.Group className="filter-item-search-tree-container">
        <FilterItemInputField
          fieldLabel="Search Tree"
          inputLabel={{ content: "root." }}
          placeholder="history.*"
          value={searchGroup.join(".")}
          onChange={(event, data) =>
            setSearchGroup(filterIndex, data.value.trim())
          }
          onClear={() => setSearchGroup(filterIndex, "")}
          disabled={searchTerms.length > 0}
        />

        <Popup
          content="Delete filter"
          trigger={
            <Form.Button
              color="red"
              icon="close"
              onClick={() => removeFilter(filterIndex)}
              type="button"
            />
          }
          position="top center"
          basic
          on="hover"
        />
      </Form.Group>

      <SearchTermItemList
        searchTerms={searchTerms}
        filterIndex={filterIndex}
        searchGroup={searchGroup}
        removeSearchTerm={removeSearchTerm}
      />

      <Tab
        panes={panes}
        onTabChange={(event, data) => setRangeValue(data.activeIndex == 1)}
        menu={{ widths: 2, pointing: true, secondary: true }}
      />
    </Form>
  );
}

export default FilterItem;

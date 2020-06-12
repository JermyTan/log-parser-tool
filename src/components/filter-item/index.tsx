import React, { useState } from "react";
import { Form, Input, Popup, Label, Transition, Icon } from "semantic-ui-react";
import { Filter } from "../../context-providers/FilterProvider";
import { FilterActions } from "../filter-item-list";
import SearchTermItemList from "../search-term-item-list";
import "./index.scss";

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

  return (
    <Form>
      <Form.Group className="filter-item-search-tree-container">
        <Form.Field className="filter-item-field">
          <label>Search Tree</label>
          <Input
            label="root."
            placeholder="history.*"
            value={searchGroup.join(".")}
            onChange={(event, data) =>
              setSearchGroup(filterIndex, data.value.trim())
            }
            disabled={searchTerms.length > 0}
            icon={
              <Transition
                visible={!!searchGroup?.[0]}
                unmountOnHide
                animation="scale"
              >
                <Icon
                  link
                  name="close"
                  onClick={() => setSearchGroup(filterIndex, "")}
                  disabled={searchTerms.length > 0}
                />
              </Transition>
            }
          />
        </Form.Field>
        <Popup
          content="Delete filter"
          trigger={
            <Form.Button
              color="red"
              icon="close"
              onClick={() => removeFilter(filterIndex)}
            />
          }
          position="top center"
        />
      </Form.Group>

      <SearchTermItemList
        searchTerms={searchTerms}
        filterIndex={filterIndex}
        searchGroup={searchGroup}
        removeSearchTerm={removeSearchTerm}
      />

      <Form.Group className="filter-item-inputs-container">
        <Form.Field className="filter-item-field">
          <label>Key Path</label>
          <Input
            label={`root.${searchGroup.join(".")}${
              searchGroup.length > 0 ? "." : ""
            }`}
            placeholder="action.type"
            value={keyPath}
            onChange={(event, data) => setKeyPath(data.value.trim())}
            icon={
              <Transition visible={!!keyPath} unmountOnHide animation="scale">
                <Icon link name="close" onClick={() => setKeyPath("")} />
              </Transition>
            }
          />
        </Form.Field>

        <div className="filter-item-equals-container">
          <Label className="filter-item-equals" content="==" />
        </div>

        <Form.Field className="filter-item-field">
          <label>Value</label>
          <Input
            placeholder="NETWORK_WEB_SOCKET_CONNECTING"
            value={value}
            onChange={(event, data) => setValue(data.value)}
            icon={
              <Transition visible={!!value} unmountOnHide animation="scale">
                <Icon link name="close" onClick={() => setValue("")} />
              </Transition>
            }
          />
        </Form.Field>
      </Form.Group>

      <Form.Group className="filter-item-actions-container">
        <Form.Button
          className="filter-item-action"
          content="Add"
          onClick={() => {
            addSearchTerm(filterIndex, {
              keyPath: keyPath.split("."),
              value: value.trim(),
              partialValueSearch,
              caseSensitiveValueSearch,
            });
            setKeyPath("");
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
    </Form>
  );
}

export default FilterItem;

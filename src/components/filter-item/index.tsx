import React, { useState } from "react";
import { Form, Input, Popup, Label, Transition, Icon } from "semantic-ui-react";
import { Filter } from "../../context-providers/FilterProvider";
import { FilterActions } from "../filter-item-list";
import SearchTermItem from "../search-term-item";
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

  return (
    <div className="filter-item-container">
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
      </Form>
      <div className="filter-item-search-terms-container">
        {searchTerms.map((value, index) => (
          <SearchTermItem
            key={index}
            searchTerm={value}
            filterIndex={filterIndex}
            searchTermIndex={index}
            removeSearchTerm={removeSearchTerm}
            searchGroup={searchGroup}
          />
        ))}
      </div>
      <Form>
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
            content="Add"
            onClick={() => {
              addSearchTerm(filterIndex, {
                keyPath: keyPath.split("."),
                value: value.trim(),
                partialValueSearch: partialValueSearch,
              });
              setKeyPath("");
              setValue("");
            }}
            compact
            primary
            disabled={!keyPath || !value.trim()}
          />

          <Form.Radio
            label="Allow partial value search"
            toggle
            checked={partialValueSearch}
            onChange={() => setPartialValueSearch(!partialValueSearch)}
          />
        </Form.Group>
      </Form>
    </div>
  );
}

export default FilterItem;

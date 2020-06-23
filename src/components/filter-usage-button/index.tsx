import React, { useState } from "react";
import { Modal, Popup, Button, Header, Label, List } from "semantic-ui-react";
import "./index.scss";

function FilterUsageButton() {
  const [openUsageSection, setOpenUsageSection] = useState(false);

  return (
    <Modal
      trigger={
        <Popup
          content="Usage"
          trigger={
            <Button
              icon="info"
              onClick={() => setOpenUsageSection(true)}
              color="teal"
            />
          }
          position="top center"
        />
      }
      open={openUsageSection}
      onClose={() => setOpenUsageSection(false)}
      closeIcon
    >
      <Modal.Header>Usage</Modal.Header>

      <Modal.Content>
        <Modal.Description>
          <Header>Terminology</Header>
          <p>
            <u>Search Tree</u>: Searches and returns the value(s) of the
            provided path.
          </p>
          <p>
            <u>Key Path</u>: Extended path within the search tree that forms
            part of a filter condition.
          </p>
          <p>
            <u>(Lower Bound/Upper Bound) Value</u>: Value that is to be compared
            with the derived value from the Key Path.
          </p>
          <br />
          <p>
            <strong>Note</strong>
            <List bulleted>
              <List.Item>Path components are separated by a period.</List.Item>
              <List.Item>
                To access nested values within an array, the indexes of the
                array elements are used as path components. E.g.{" "}
                <code>history.0.action, history.1.date</code>.
              </List.Item>
              <List.Item>
                <code>*</code> is used as a wildcard path component. This is
                typically used to indicate paths that include all elements of
                the array. E.g.{" "}
                <code>
                  history.*.action == history.0.action, history.1.action, ...
                </code>
              </List.Item>
            </List>
          </p>
        </Modal.Description>
      </Modal.Content>

      <Modal.Content>
        <Modal.Description>
          <Header>Filter Condition Colour Legend</Header>
          <p className="filter-condition-legend-section">
            <Label className="filter-condition-label" color="grey" />
            <span>
              : <strong>Exact</strong> and <strong>case-insensitive</strong>{" "}
              value search.
            </span>
          </p>
          <p className="filter-condition-legend-section">
            <Label className="filter-condition-label" color="grey" basic />
            <span>
              : <strong>Partial</strong> and <strong>case-insensitive</strong>{" "}
              value search.
            </span>
          </p>
          <p className="filter-condition-legend-section">
            <Label className="filter-condition-label" color="brown" />
            <span>
              : <strong>Exact</strong> and <strong>case-sensitive</strong> value
              search.
            </span>
          </p>
          <p className="filter-condition-legend-section">
            <Label className="filter-condition-label" color="brown" basic />
            <span>
              : <strong>Partial</strong> and <strong>case-sensitive</strong>{" "}
              value search.
            </span>
          </p>
          <p className="filter-condition-legend-section">
            <Label className="filter-condition-label" color="violet" />
            <span>
              : <strong>Range</strong> value search.
            </span>
          </p>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

export default FilterUsageButton;

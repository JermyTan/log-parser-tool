import React, { useState } from "react";
import { Button, Modal, TransitionablePortal, Popup } from "semantic-ui-react";
import "./index.scss";

function FilterButton() {
  const [openFilterOptions, setOpenFilterOptions] = useState(false);

  return (
    <>
      <Button
        content="Filter"
        primary
        compact
        onClick={() => setOpenFilterOptions(true)}
      />
      <TransitionablePortal
        open={openFilterOptions}
        transition={{ animation: "fade" }}
      >
        <Modal open={true} onClose={() => setOpenFilterOptions(false)}>
          <Modal.Header className="filter-options-header">
            Filter Options
            <span>
              <Popup
                content="Add filter"
                trigger={
                  <Button color="teal" icon="plus" compact floated="right" />
                }
                position="top center"
              />
            </span>
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>Inputs</Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Back"
              onClick={() => setOpenFilterOptions(false)}
            />
            <Button
              primary
              content="Apply"
              onClick={() => setOpenFilterOptions(false)}
            />
          </Modal.Actions>
        </Modal>
      </TransitionablePortal>
    </>
  );
}

export default FilterButton;

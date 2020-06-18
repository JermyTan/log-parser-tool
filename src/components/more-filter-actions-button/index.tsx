import React, { useState, useContext } from "react";
import {
  Popup,
  Button,
  Modal,
  Form,
  Header,
  Icon,
  Grid,
  List,
  Segment,
  Message,
  Transition,
} from "semantic-ui-react";
import { PreferencesContext } from "../../context-providers/PreferencesProvider";
import { Filter } from "../../context-providers/FilterProvider";
import FilterItemInputField from "../filter-item-input-field";
import "./index.scss";
import { useStateWithCallback } from "../../utils/custom-hooks";

type Props = {
  currentFilters: Filter[];
  setCurrentFilters: (filters: Filter[]) => void;
};

function MoreFilterActionsButton({ currentFilters, setCurrentFilters }: Props) {
  const [openMoreActions, setOpenMoreActions] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedFilterPreference, setSelectedFilterPreference] = useState("");
  const [showSuccessMsg, setShowSuccessMsg] = useStateWithCallback(false);
  const { filterPreferences, setFilterPreferences } = useContext(
    PreferencesContext
  );
  const preferenceTitles = Object.keys(filterPreferences);
  const trimmedTitle = title.trim();

  const resetStates = () => {
    setTitle("");
    setSelectedFilterPreference("");
    setShowSuccessMsg(false);
    setOpenMoreActions(false);
  };

  return (
    <Modal
      trigger={
        <Popup
          content="More actions"
          trigger={
            <Button
              icon="ellipsis horizontal"
              onClick={() => setOpenMoreActions(true)}
            />
          }
          position="top center"
        />
      }
      open={openMoreActions}
      onClose={() => {
        resetStates();
      }}
      closeIcon
      style={{ justifyContent: "center" }}
    >
      <Modal.Header>More Actions</Modal.Header>

      <Modal.Content>
        <Grid columns="2" relaxed stackable padded>
          <Grid.Column>
            <Form>
              <Header textAlign="center">Save Current Filter Options</Header>
              <Message
                hidden={currentFilters.length > 0}
                header="Empty Filter Options"
                content="Unable to save empty filter options."
                negative
                icon="warning circle"
                size="tiny"
              />
              <FilterItemInputField
                fieldLabel="Title"
                inputLabel={{ content: "Save As:" }}
                value={title}
                onChange={(event, data) => setTitle(data.value)}
                onClear={() => setTitle("")}
                disabled={currentFilters.length === 0}
              />
              <Form.Button
                animated="vertical"
                primary
                fluid
                disabled={currentFilters.length === 0 || !trimmedTitle}
                onClick={() => {
                  setFilterPreferences({
                    ...filterPreferences,
                    [trimmedTitle]: currentFilters,
                  });
                  setTitle("");
                  setShowSuccessMsg(true, () =>
                    setTimeout(() => setShowSuccessMsg(false), 3000)
                  );
                }}
              >
                <Button.Content hidden content="Save" />
                <Button.Content visible content={<Icon name="save" />} />
              </Form.Button>
              <Transition
                visible={preferenceTitles.some(
                  (preferenceTitle) => preferenceTitle === trimmedTitle
                )}
                unmountOnHide
              >
                <Message
                  header="Title Already Exists"
                  content="Saving current filter options with this title will override the existing saved filter options."
                  warning
                  icon="warning sign"
                  size="tiny"
                />
              </Transition>
              <Transition
                visible={showSuccessMsg}
                unmountOnHide
                animation="scale"
              >
                <Message
                  header="Success"
                  content="Current filter options has been successfully saved."
                  positive
                  icon="check circle"
                  size="tiny"
                />
              </Transition>
            </Form>
          </Grid.Column>

          <Grid.Column>
            <Form>
              <Header textAlign="center">All Saved Filter Options</Header>
              <Form.Field className="filter-preferences-list">
                {preferenceTitles.length > 0 ? (
                  <List
                    selection
                    divided
                    verticalAlign="middle"
                    items={preferenceTitles.map((preferenceTitle) => {
                      return (
                        <List.Item
                          key={preferenceTitle}
                          className="filter-preference-item"
                          active={preferenceTitle === selectedFilterPreference}
                        >
                          <List.Content
                            className="filter-preference-item-title"
                            onClick={() =>
                              setSelectedFilterPreference(preferenceTitle)
                            }
                          >
                            <div>{preferenceTitle}</div>
                          </List.Content>

                          <List.Content className="filter-preference-item-button">
                            <Popup
                              content="Delete"
                              trigger={
                                <Form.Button
                                  color="red"
                                  icon="close"
                                  type="button"
                                  compact
                                  onClick={() => {
                                    const copy = { ...filterPreferences };
                                    delete copy[preferenceTitle];
                                    setFilterPreferences(copy);
                                    preferenceTitle ===
                                      selectedFilterPreference &&
                                      setSelectedFilterPreference("");
                                  }}
                                />
                              }
                              position="left center"
                              basic
                              on="hover"
                            />
                          </List.Content>
                        </List.Item>
                      );
                    })}
                  />
                ) : (
                  <Segment
                    basic
                    placeholder
                    textAlign="center"
                    content={
                      <h4>There are currently no saved filter options</h4>
                    }
                  />
                )}
              </Form.Field>

              <Form.Group widths="2">
                <Form.Button
                  animated="vertical"
                  color="red"
                  fluid
                  type="button"
                  onClick={() => {
                    setFilterPreferences({});
                    setSelectedFilterPreference("");
                  }}
                  disabled={preferenceTitles.length === 0}
                >
                  <Button.Content hidden content="Clear All" />
                  <Button.Content
                    visible
                    content={<Icon name="trash alternate" />}
                  />
                </Form.Button>
                <Form.Button
                  animated="vertical"
                  primary
                  fluid
                  disabled={!selectedFilterPreference}
                  onClick={() => {
                    setCurrentFilters(
                      filterPreferences[selectedFilterPreference]
                    );
                    resetStates();
                  }}
                >
                  <Button.Content hidden content="Load" />
                  <Button.Content visible content={<Icon name="download" />} />
                </Form.Button>
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid>
      </Modal.Content>
    </Modal>
  );
}

export default MoreFilterActionsButton;

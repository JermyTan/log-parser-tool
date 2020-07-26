import React, { useState, useEffect } from "react";
import { Segment, Grid, Icon, Header, Transition } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import "./index.scss";
import styled from "styled-components";
import { useLogsFromUpload } from "../../../utils/custom-hooks";
import MainViewer from "../../main-viewer";

const getColor = ({ isDragAccept, isDragReject, isDragActive }: any) => {
  if (isDragAccept) {
    return "#00e676";
  }
  if (isDragReject) {
    return "#ff1744";
  }
  if (isDragActive) {
    return "#2196f3";
  }
  return "#eeeeee";
};

const DragNDropContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 20rem;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  cursor: pointer;
`;

function Homepage() {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragActive,
    isDragReject,
  } = useDropzone({
    accept: "application/zip",
    multiple: false,
  });
  const [loading, invalid, logs] = useLogsFromUpload(acceptedFiles?.[0]);
  const [isHomeView, setHomeView] = useState(false);

  useEffect(() => {
    setHomeView(acceptedFiles.length === 0);
  }, [acceptedFiles]);

  return (
    <>
      {acceptedFiles.length > 0 ? (
        <MainViewer loading={loading} invalid={invalid} logs={logs} />
      ) : (
        <Grid
          className="homepage-container"
          container
          columns="1"
          verticalAlign="middle"
          textAlign="center"
        >
          <Grid.Column>
            <Transition animation="scale" visible={isHomeView}>
              <Segment padded raised secondary>
                <Grid columns="2" relaxed stackable verticalAlign="middle">
                  <Grid.Column>
                    <DragNDropContainer
                      {...getRootProps({
                        isDragAccept,
                        isDragActive,
                        isDragReject,
                      })}
                    >
                      <input {...getInputProps()} />
                      <Header icon>
                        <Icon name="file archive outline" />
                        Drag and Drop, or Click to upload the zip file.
                      </Header>
                    </DragNDropContainer>
                  </Grid.Column>
                  <Grid.Column>
                    <Icon
                      className="homepage-icon"
                      name="file alternate"
                      size="massive"
                    />
                    <Header as="h1">Log Parser Tool</Header>
                  </Grid.Column>
                </Grid>
              </Segment>
            </Transition>
          </Grid.Column>
        </Grid>
      )}
    </>
  );
}

export default Homepage;

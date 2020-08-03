import React, { useState } from "react";
import {
  Container,
  Segment,
  Tab,
  Loader,
  Icon,
  Popup,
  Button,
} from "semantic-ui-react";
import { LazyLog } from "../lazy-log/components";
import Fullscreen from "../fullscreen";
import JsonViewer from "../json-viewer";
import DownloadButton from "../download-button";
import "./index.scss";
import GraphViewer from "../graph-viewer";

type Props = {
  loading: boolean;
  invalid: boolean;
  logs: any;
};

const hiddenStyle: React.CSSProperties = { visibility: "hidden" };

const renderViewer = (filename: string, data: any) => {
  if (typeof data === "string") {
    return filename === "profile.log" ? (
      <GraphViewer
        data={data
          .slice(0, -1)
          .split("\n")
          .map((line) => JSON.parse(line))}
      />
    ) : (
      <LazyLog
        extraLines={1}
        enableSearch
        text={data as string}
        caseInsensitive
        selectableLines
      />
    );
  } else {
    return <JsonViewer filename={filename} data={data as object} />;
  }
};

function MainViewer({ loading, invalid, logs }: Props) {
  const [isFullscreen, setFullscreen] = useState(false);

  const panes = Object.entries(logs).map(([filename, data]) => {
    return {
      menuItem: filename,
      pane: (
        <Tab.Pane
          key={filename}
          className={
            filename === "profile.log"
              ? "main-viewer-pane-graph"
              : "main-viewer-pane"
          }
          attached={false}
          loading={data === undefined}
        >
          {data ? (
            renderViewer(filename, data)
          ) : (
            <h2 className="main-viewer-empty-log-label">Empty log file</h2>
          )}
        </Tab.Pane>
      ),
    };
  });

  return (
    <Container className="main-viewer-container">
      <div
        className="main-viewer-header-container"
        style={isFullscreen ? hiddenStyle : {}}
      >
        <h1 className="main-viewer-header">Logs</h1>
        <Popup
          content="Back to home"
          trigger={
            <Button
              className="header-button"
              icon="home"
              primary
              onClick={() => (window.location.href = "/")}
            />
          }
          position="bottom center"
        />

        <DownloadButton className="header-button" logs={logs} />
      </div>

      {!invalid && !loading ? (
        <Fullscreen fullScreen={isFullscreen} allowScrollbar={true}>
          <div className="main-viewer-fullscreen">
            <Popup
              content={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              trigger={
                <Icon
                  name={isFullscreen ? "compress" : "expand"}
                  link
                  onClick={() => setFullscreen(!isFullscreen)}
                  size="large"
                />
              }
              basic
              position="top center"
            />
          </div>

          <Tab
            menu={{
              attached: false,
              size: "large",
            }}
            panes={panes}
            renderActiveOnly={false}
          />
        </Fullscreen>
      ) : (
        <Segment basic placeholder textAlign="center">
          {loading && (
            <Loader
              size="massive"
              active
              className="main-viewer-loader"
              inline
              content="Loading log files"
            />
          )}
          {invalid && <h2>Invalid logs</h2>}
        </Segment>
      )}
    </Container>
  );
}

export default MainViewer;

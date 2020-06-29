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
import "./index.scss";

type Props = {
  loading: boolean;
  invalid: boolean;
  logs: any;
};

const hiddenStyle: React.CSSProperties = { visibility: "hidden" };

function MainViewer({ loading, invalid, logs }: Props) {
  const [isFullscreen, setFullscreen] = useState(false);

  const panes = Object.entries(logs).map(([key, value]) => {
    return {
      menuItem: key,
      pane: (
        <Tab.Pane
          key={key}
          className="main-viewer-pane"
          attached={false}
          loading={value === undefined}
        >
          {value ? (
            typeof value === "string" ? (
              <LazyLog
                extraLines={1}
                enableSearch
                text={value as string}
                caseInsensitive
                selectableLines
              />
            ) : (
              <JsonViewer filename={key} data={value as object} />
            )
          ) : (
            <h2 className="main-viewer-empty-log-label">Empty log file</h2>
          )}
        </Tab.Pane>
      ),
    };
  });

  return (
    <Container className="main-viewer-container">
      <div className="main-viewer-header-container">
        <h1
          className="main-viewer-header"
          style={isFullscreen ? hiddenStyle : {}}
        >
          Logs
        </h1>
        <Button
          className="home-button"
          content="Home"
          primary
          onClick={() => (window.location.href = "/")}
        />
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

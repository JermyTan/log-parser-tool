import React, { useState } from "react";
import {
  Container,
  Segment,
  Tab,
  Loader,
  Icon,
  Popup,
} from "semantic-ui-react";
import { useLogs } from "../../../utils/custom-hooks";
import { LazyLog } from "../../lazy-log/components";
import Fullscreen from "../../fullscreen";
import JsonViewer from "../../json-viewer";
import "./index.scss";

const hiddenStyle: React.CSSProperties = { visibility: "hidden" };

function LogInfoPage() {
  const [loading, invalid, logs] = useLogs();
  const [isFullscreen, setFullscreen] = useState(false);

  const panes = Object.entries(logs).map(([key, value]) => {
    return {
      menuItem: key,
      pane: (
        <Tab.Pane
          key={key}
          className="log-info-pane"
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
            <h2 className="log-info-empty-log-label">Empty log file</h2>
          )}
        </Tab.Pane>
      ),
    };
  });

  return (
    <main>
      <Container className="log-info-container">
        <h1 style={isFullscreen ? hiddenStyle : {}}>Logs</h1>

        {!invalid && !loading ? (
          <Fullscreen fullScreen={isFullscreen} allowScrollbar={true}>
            <div className="log-info-fullscreen">
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
                className="log-info-loader"
                inline
                content="Loading log files"
              />
            )}
            {invalid && <h2>Invalid logs</h2>}
          </Segment>
        )}
      </Container>
    </main>
  );
}

export default LogInfoPage;

import React, { useState } from "react";
import { Container, Segment, Tab, Loader, Icon } from "semantic-ui-react";
import { useLogs } from "../../../utils/custom-hooks";
import { LazyLog } from "../../lazy-log/components";
import Fullscreen from "react-full-screen";
import "./index.scss";

function LogInfoPage() {
  const [loading, invalid, logs] = useLogs();
  const [fullscreen, setFullscreen] = useState(false);

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
            <LazyLog
              extraLines={1}
              enableSearch
              text={value as string}
              caseInsensitive
              selectableLines
            />
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
        <h1 className="log-info-header">Logs</h1>

        {!invalid && !loading ? (
          <Fullscreen
            enabled={fullscreen}
            onChange={(fullscreen) => setFullscreen(fullscreen)}
          >
            <div className="log-info-fullscreen">
              <Icon
                name={fullscreen ? "compress" : "expand"}
                link
                onClick={() => setFullscreen(!fullscreen)}
                size="large"
              />
            </div>

            <Tab
              className="log-info-tab"
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

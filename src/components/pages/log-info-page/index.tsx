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
import Fullscreen from "react-full-screen";
import JSONTree from "react-json-tree";
import "./index.scss";

const theme = {
  scheme: "monokai",
  author: "wimer hazenberg (http://www.monokai.nl)",
  base00: "#272822",
  base01: "#383830",
  base02: "#49483e",
  base03: "#75715e",
  base04: "#a59f85",
  base05: "#f8f8f2",
  base06: "#f5f4f1",
  base07: "#f9f8f5",
  base08: "#f92672",
  base09: "#fd971f",
  base0A: "#f4bf75",
  base0B: "#a6e22e",
  base0C: "#a1efe4",
  base0D: "#66d9ef",
  base0E: "#ae81ff",
  base0F: "#cc6633",
};

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
            typeof value === "string" ? (
              <LazyLog
                extraLines={1}
                enableSearch
                text={value as string}
                caseInsensitive
                selectableLines
              />
            ) : (
              <div className="log-info-json-viewer">
                <JSONTree
                  data={value as object}
                  invertTheme={false}
                  theme={theme}
                  shouldExpandNode={() => true}
                />
              </div>
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
        <h1 className="log-info-header">Logs</h1>

        {!invalid && !loading ? (
          <Fullscreen
            enabled={fullscreen}
            onChange={(fullscreen) => setFullscreen(fullscreen)}
          >
            <div className="log-info-fullscreen">
              <Popup
                content={fullscreen ? "Exit full screen" : "Full screen"}
                trigger={
                  <Icon
                    name={fullscreen ? "compress" : "expand"}
                    link
                    onClick={() => setFullscreen(!fullscreen)}
                    size="large"
                  />
                }
                position="top center"
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

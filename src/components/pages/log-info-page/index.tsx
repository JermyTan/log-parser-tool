import React from "react";
import { Container, Segment, Tab } from "semantic-ui-react";
import { useLogs } from "../../../utils/custom-hooks";
import { LazyLog } from "../../lazy-log/components";
import "./index.scss";

function LogInfoPage() {
  const [loading, invalid, logs] = useLogs();

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
          {value && (
            <LazyLog
              extraLines={1}
              enableSearch
              text={value as string}
              caseInsensitive
              selectableLines
            />
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
          <Tab
            className="log-info-tab"
            menu={{
              attached: false,
              size: "large",
            }}
            panes={panes}
            renderActiveOnly={false}
          />
        ) : (
          <Segment
            className="log-info-loader"
            size="massive"
            basic
            placeholder
            content={invalid ? "Invalid logs" : ""}
            textAlign="center"
            loading={loading}
          />
        )}
      </Container>
    </main>
  );
}

export default LogInfoPage;

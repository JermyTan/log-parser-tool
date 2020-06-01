import React from "react";
import { Container, Segment, Tab } from "semantic-ui-react";
import { useLogs } from "../../../utils/custom-hooks";
import { LazyLog } from "../../lazy-log/components";
import "./index.scss";

function LogInfoPage() {
  const [loadingState, invalid, logs] = useLogs();

  const panes = Object.entries(logs).map(([key, value]) => {
    return {
      menuItem: key,
      pane: (
        <Tab.Pane key={key} className="log-info-pane" attached={false}>
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

  console.log(loadingState);
  return (
    <main>
      <Container className="log-info-container">
        <h1 className="log-info-header">Logs</h1>

        {!invalid &&
        !loadingState.loading &&
        loadingState.pendingLoads === 0 ? (
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
            loading={loadingState.loading || loadingState.pendingLoads > 0}
            raised
          />
        )}
      </Container>
    </main>
  );
}

export default LogInfoPage;

import React from "react";
import { useLogsFromUrl } from "../../../utils/custom-hooks";
import MainViewer from "../../main-viewer";

function LogInfoPage() {
  const [loading, invalid, logs] = useLogsFromUrl();

  return (
    <main>
      <MainViewer loading={loading} invalid={invalid} logs={logs} />
    </main>
  );
}

export default LogInfoPage;

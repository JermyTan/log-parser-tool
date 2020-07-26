import React from "react";
import { useLogsFromUrl } from "../../../utils/custom-hooks";
import MainViewer from "../../main-viewer";

function LogInfoPage() {
  const [loading, invalid, logs] = useLogsFromUrl();

  return <MainViewer loading={loading} invalid={invalid} logs={logs} />;
}

export default LogInfoPage;

import React from "react";
import { Button } from "semantic-ui-react";
import JSONTree from "react-json-tree";
import FilterButton from "../filter-button";
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

type Props = {
  data: {} | [any];
};

function JsonViewer(props: Props) {
  return (
    <div className="json-viewer-container">
      <div className="json-viewer-action-buttons">
        <FilterButton />
        <Button content="Reset" color="red" compact />
      </div>
      <JSONTree
        data={props.data}
        invertTheme={false}
        theme={{
          extend: theme,
          tree: {
            margin: 0,
            overflow: "auto",
            whiteSpace: "nowrap",
            padding: "0.5rem 0 1rem 1rem",
            flexGrow: 1,
            backgroundColor: "#222222",
          },
        }}
        shouldExpandNode={() => true}
      />
    </div>
  );
}

export default JsonViewer;

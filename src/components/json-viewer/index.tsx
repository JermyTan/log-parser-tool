import React, { useContext, useState } from "react";
import { Button } from "semantic-ui-react";
import JSONTree from "../json-tree";
import FilterButton from "../filter-button";
import { FilterContext } from "../../context-providers/FilterProvider";
import Queue from "queue-fifo";
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
  filename: string;
  data: {} | [any];
};

function JsonViewer({ filename, data }: Props) {
  const { getFilters } = useContext(FilterContext);
  const filters = getFilters(filename);
  const [isFiltering, setFiltering] = useState(false);
  const activeFilter = isFiltering && filters.length > 0;

  const renderJson = (): any => {
    if (!activeFilter) {
      return data;
    } else {
      const result: any[] = [];

      filters.forEach((filter) => {
        const queue = new Queue<{
          node: any;
          componentIndex: number;
        }>();
        const path = filter.searchGroup;
        const numComponents = path.length;
        const candidateResults: any[] = [];

        queue.enqueue({ node: data, componentIndex: 0 });

        while (!queue.isEmpty()) {
          let { node, componentIndex } = queue.dequeue() ?? {
            node: {},
            componentIndex: Number.POSITIVE_INFINITY,
          };
          if (componentIndex >= numComponents) {
            break;
          } else if (typeof node !== "object") {
            continue;
          }

          const currentComponent = path[componentIndex++];

          let neighbours: any[];
          if (currentComponent === "*") {
            neighbours = Object.values(node);
          } else {
            const neighbour = node?.[currentComponent];
            neighbours = neighbour ? [neighbour] : [];
          }

          neighbours.forEach((neighbour) => {
            if (componentIndex >= numComponents) {
              candidateResults.push(neighbour);
            } else {
              queue.enqueue({ node: neighbour, componentIndex });
            }
          });
        }

        console.log(candidateResults);

        const searchTerms = filter.searchTerms;
        const numSearchTerms = searchTerms.length;
        candidateResults.forEach((candidateResult) => {
          let numValidSearchTerms = 0;

          searchTerms.forEach((searchTerm) => {
            const queue = new Queue<{
              node: any;
              componentIndex: number;
            }>();
            const path = searchTerm.keyPath;
            const numComponents = path.length;

            queue.enqueue({ node: candidateResult, componentIndex: 0 });

            while (!queue.isEmpty()) {
              let { node, componentIndex } = queue.dequeue() ?? {
                node: {},
                componentIndex: Number.POSITIVE_INFINITY,
              };

              if (componentIndex === numComponents) {
                if (typeof node === "object") {
                  continue;
                }

                let sourceValue: string = node.toString();
                let inputValue = searchTerm.value;

                if (!searchTerm.caseSensitiveValueSearch) {
                  sourceValue = sourceValue.toLowerCase();
                  inputValue = inputValue.toLowerCase();
                }

                ((searchTerm.partialValueSearch &&
                  sourceValue.includes(inputValue)) ||
                  sourceValue === inputValue) &&
                  numValidSearchTerms++;

                continue;
              } else if (typeof node !== "object") {
                continue;
              }

              const currentComponent = path[componentIndex++];

              let neighbours: any[];
              if (currentComponent === "*") {
                neighbours = Object.values(node);
              } else {
                const neighbour = node?.[currentComponent];
                neighbours = neighbour ? [neighbour] : [];
              }

              neighbours.forEach((neighbour) => {
                queue.enqueue({ node: neighbour, componentIndex });
              });
            }
          });

          numValidSearchTerms === numSearchTerms &&
            result.push(candidateResult);
        });
      });

      return [...(new Set(result) as any)];
    }
  };

  console.log(filters.length);

  return (
    <div className="json-viewer-container">
      <div className="json-viewer-action-buttons">
        <FilterButton
          filename={filename}
          applyFilter={() => setFiltering(true)}
        />
        <Button
          content="Reset"
          color="red"
          compact
          disabled={!activeFilter}
          onClick={() => setFiltering(false)}
        />
      </div>
      <JSONTree
        data={renderJson()}
        invertTheme={false}
        theme={{
          extend: theme,
          tree: {
            margin: 0,
            overflow: "auto",
            whiteSpace: "nowrap",
            padding: "0 0 1rem 1rem",
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

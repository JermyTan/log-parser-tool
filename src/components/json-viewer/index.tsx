import React, { useContext, useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import FilterButton from "../filter-button";
import { FilterContext } from "../../context-providers/FilterProvider";
import { LazyLog } from "../lazy-log/components";
import Queue from "queue-fifo";
// @ts-ignore
import RBTree from "functional-red-black-tree";
import "./index.scss";

type Props = {
  filename: string;
  data: any;
};

type DataState = {
  dataString: string;
  jumpIndexes: any;
};

const computeDataState = (data: any): DataState => {
  const dataString = JSON.stringify(data, null, 2);

  if (!data?.history && !Array.isArray(data)) {
    return { dataString, jumpIndexes: RBTree() };
  }

  const dataStringArray = dataString.split("\n");
  let jumpIndexes = RBTree();

  if (Array.isArray(data)) {
    dataStringArray.forEach((line, index) => {
      if (
        line.startsWith("  ") &&
        !line.startsWith("   ") &&
        !line.startsWith("  }") &&
        !line.startsWith("  ]")
      ) {
        jumpIndexes = jumpIndexes.insert(index + 1, true);
      }
    });
  } else {
    dataStringArray.forEach((line, index) => {
      if (line.startsWith('      "action":')) {
        jumpIndexes = jumpIndexes.insert(index + 1, true);
      }
    });
  }

  console.log("jump indexes", jumpIndexes.length);
  return { dataString, jumpIndexes };
};

function JsonViewer({ filename, data }: Props) {
  const { getFilters } = useContext(FilterContext);
  const filters = getFilters(filename);
  const [isFiltering, setFiltering] = useState(false);
  const [originalDataState, setOriginalDataState] = useState<DataState>({
    dataString: "",
    jumpIndexes: RBTree(),
  });
  const [activeDataState, setActiveDataState] = useState(originalDataState);
  const activeFilter = isFiltering && filters.length > 0;

  useEffect(() => {
    setOriginalDataState(computeDataState(data));
  }, []);

  const onScroll = ({ scrollTop }: any) => {
    const currentLineNum = Math.round(scrollTop / 19) + 1;
    console.log(`current line num: ${currentLineNum}`);
  };

  const processJson = () => {
    if (!activeFilter) {
      setActiveDataState(originalDataState);
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

      setActiveDataState(computeDataState([...(new Set(result) as any)]));
    }
  };

  useEffect(() => {
    console.log("run effect");
    processJson();
  }, [filters]);

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

      <LazyLog
        extraLines={1}
        enableSearch
        text={activeDataState.dataString}
        caseInsensitive
        selectableLines
        onScroll={onScroll}
        scrollToAlignment="start"
      />
    </div>
  );
}

export default JsonViewer;

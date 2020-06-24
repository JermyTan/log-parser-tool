import React, { useContext, useState, useEffect } from "react";
import { Button, Popup, ButtonProps } from "semantic-ui-react";
import FilterButton from "../filter-button";
import {
  FilterContext,
  Filter,
  EqualValue,
  RangeValue,
} from "../../context-providers/FilterProvider";
import { LazyLog } from "../lazy-log/components";
import Queue from "queue-fifo";
// @ts-ignore
import RBTree from "functional-red-black-tree";
import { useStateWithCallback } from "../../utils/custom-hooks";
import { parseStringToDate, isNumeric } from "../../utils/types-util";
import "./index.scss";
import { Dayjs } from "dayjs";

type Props = {
  filename: string;
  data: any;
};

type DataState = {
  data: any;
  dataString: string;
  jumpIndexes: any;
  dataLines: DataLine[];
};

type DataLine = {
  value: string;
  collapsedLines: DataLine[];
};

// 1-based
type AdjacentJumpIndexes = {
  prev: number;
  next: number;
};

type QueueNode = {
  node: any;
  componentIndex: number;
};

const computeDataState = (data: any): DataState => {
  const dataString = JSON.stringify(data, null, 2);
  const dataStringArray = dataString.split("\n");
  const dataLines: DataLine[] = dataStringArray.map((value) => {
    return { value, collapsedLines: [] };
  });
  const jumpIndexes = computeJumpIndexes(data, dataLines);

  return { data, dataString, jumpIndexes, dataLines };
};

const computeJumpIndexes = (data: any, dataLines: DataLine[]): any => {
  let jumpIndexes = RBTree();

  if (!data?.history && !Array.isArray(data)) {
    return jumpIndexes;
  }

  if (Array.isArray(data)) {
    dataLines.forEach(({ value }, index) => {
      if (
        value.startsWith("  ") &&
        !value.startsWith("   ") &&
        !value.startsWith("  }") &&
        !value.startsWith("  ]")
      ) {
        jumpIndexes = jumpIndexes.insert(index + 1, true);
      }
    });
  } else {
    dataLines.forEach(({ value }, index) => {
      if (value.startsWith('      "action":')) {
        jumpIndexes = jumpIndexes.insert(index + 1, true);
      }
    });
  }

  //console.log("jump indexes", jumpIndexes.length);
  return jumpIndexes;
};

function JsonViewer({ filename, data }: Props) {
  const { getFilters, updateFilters } = useContext(FilterContext);
  const filters = getFilters(filename);
  const [isFiltering, setFiltering] = useState(false);
  const [originalDataState, setOriginalDataState] = useState<DataState>({
    data: "",
    dataString: "",
    jumpIndexes: RBTree(),
    dataLines: [{ value: "", collapsedLines: [] }],
  });
  const [activeDataState, setActiveDataState] = useStateWithCallback(
    originalDataState
  );
  const [adjacentJumpIndexes, setAdjacentJumpIndexes] = useState<
    AdjacentJumpIndexes
  >({ prev: 0, next: Number.MAX_SAFE_INTEGER });
  const [selectedJumpIndex, setSelectedJumpIndex] = useStateWithCallback<
    number | undefined
  >(undefined);
  const [currentJumpIndex, setCurrentJumpIndex] = useState<
    number | undefined
  >();
  const [currentLineNum, setCurrentLineNum] = useState<number>(1);
  const [isSearching, setSearching] = useState(false);
  const activeFilter = isFiltering && filters.length > 0;

  const prepareDataForRender = (dataState: DataState) => {
    setActiveDataState(dataState);
    const firstJumpIndex =
      dataState.jumpIndexes.gt(0).key ?? Number.MAX_SAFE_INTEGER;
    setAdjacentJumpIndexes({ prev: 0, next: firstJumpIndex });
  };

  const updateAdjacentJumpIndexes = (newIndex: number, jumpIndexes: any) => {
    const newPrev = jumpIndexes.lt(newIndex).key ?? 0;
    const newNext = jumpIndexes.gt(newIndex).key ?? Number.MAX_SAFE_INTEGER;
    setAdjacentJumpIndexes({ prev: newPrev, next: newNext });
    setCurrentJumpIndex(jumpIndexes.get(newIndex) ? newIndex : undefined);
    console.log(`new prev: ${newPrev}, new next: ${newNext}`);
  };

  useEffect(() => {
    const dataState = computeDataState(data);
    setOriginalDataState(dataState);
    prepareDataForRender(dataState);
    updateFilters(filename, []);
  }, []);

  const onScroll = ({ scrollTop }: any) => {
    const lineNum = Math.round(scrollTop / 19) + 1;
    console.log(`current line num: ${lineNum}`);
    setCurrentLineNum(lineNum);

    const { prev, next } = adjacentJumpIndexes;

    if (selectedJumpIndex) {
      setSelectedJumpIndex(undefined);
    }

    if (
      lineNum <= prev ||
      lineNum >= next ||
      (currentJumpIndex && currentJumpIndex !== lineNum)
    ) {
      updateAdjacentJumpIndexes(lineNum, activeDataState.jumpIndexes);
    }
  };

  const processJson = (activeFilter: boolean, filters: Filter[]) => {
    if (!activeFilter) {
      prepareDataForRender(originalDataState);
      return;
    }

    const result: any[] = [];

    filters.forEach((filter) => {
      const queue = new Queue<QueueNode>();
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
          const queue = new Queue<QueueNode>();
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

              let sourceValue = node;
              let evaluation = true;

              if (searchTerm.isRangeValue) {
                const { bounds } = searchTerm.value as RangeValue;
                const { lowerBound, upperBound } = { ...bounds };

                if (isNumeric(sourceValue)) {
                  if (lowerBound) {
                    evaluation =
                      evaluation &&
                      isNumeric(lowerBound) &&
                      Number(lowerBound) <= sourceValue;
                  }
                  if (upperBound) {
                    evaluation =
                      evaluation &&
                      isNumeric(upperBound) &&
                      sourceValue <= Number(upperBound);
                  }
                } else {
                  sourceValue = sourceValue.toString();
                  const {
                    date: sourceValueDate,
                    isValidDate: isValidSourceValueDate,
                  } = parseStringToDate(sourceValue);

                  if (isValidSourceValueDate) {
                    if (lowerBound) {
                      const { date: lowerBoundDate } = parseStringToDate(
                        lowerBound
                      );
                      evaluation =
                        evaluation &&
                        (lowerBoundDate?.isSameOrBefore(
                          sourceValueDate as Dayjs
                        ) ??
                          false);
                    }
                    if (upperBound) {
                      const { date: upperBoundDate } = parseStringToDate(
                        upperBound
                      );
                      evaluation =
                        evaluation &&
                        (upperBoundDate?.isSameOrAfter(
                          sourceValueDate as Dayjs
                        ) ??
                          false);
                    }
                  } else {
                    evaluation = lowerBound
                      ? evaluation && lowerBound <= sourceValue
                      : evaluation;
                    evaluation = upperBound
                      ? evaluation && sourceValue <= upperBound
                      : evaluation;
                  }
                }
              } else {
                sourceValue = sourceValue.toString();
                const value = searchTerm.value as EqualValue;
                let inputValue = value.content;
                const { caseSensitiveValueSearch, partialValueSearch } = value;

                if (!caseSensitiveValueSearch) {
                  sourceValue = sourceValue.toLowerCase();
                  inputValue = inputValue.toLowerCase();
                }

                evaluation =
                  (partialValueSearch && sourceValue.includes(inputValue)) ||
                  sourceValue === inputValue;
              }

              evaluation && numValidSearchTerms++;

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

        numValidSearchTerms === numSearchTerms && result.push(candidateResult);
      });
    });

    prepareDataForRender(computeDataState([...(new Set(result) as any)]));
  };

  useEffect(() => {
    console.log("process json");
    setSelectedJumpIndex(1, () => processJson(activeFilter, filters));
  }, [filters, activeFilter]);

  //console.log(filters.length);

  const handleArrowClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    data: ButtonProps
  ) => {
    const newJumpIndex = data.value;
    setSelectedJumpIndex(newJumpIndex);
  };

  const handleRowClick = (lineNum: number) => {
    const { data, dataLines } = activeDataState;

    // ignore if isSearching or clicked on extra last line
    if (isSearching || lineNum > dataLines.length) {
      return;
    }

    const { collapsedLines, value } = dataLines[lineNum - 1];
    // expand
    if (collapsedLines.length > 0) {
      // expand data lines
      dataLines.splice(lineNum - 1, 1, ...collapsedLines);
      // collapse
    } else if (value.endsWith("{") || value.endsWith("[")) {
      const openingBracket = value.slice(-1);
      const numLeadingWhiteSpaces = value.search(/\S|$/);
      const closingBracket = openingBracket === "{" ? "}" : "]";
      const matchingIndentedClosingBracket = `${" ".repeat(
        numLeadingWhiteSpaces
      )}${closingBracket}`;

      // find the line containing the corresponding closing bracket
      let endIndex = lineNum - 1;
      while (
        !dataLines[++endIndex].value.startsWith(matchingIndentedClosingBracket)
      );

      const closingDataLine = dataLines[endIndex];
      const newSelectedDataLine: DataLine = {
        value: `${value}...${closingDataLine.value.trim()}`,
        collapsedLines: [],
      };

      // collapse data lines
      const newCollapsedLines = dataLines.splice(
        lineNum - 1,
        endIndex - lineNum + 2,
        newSelectedDataLine
      );
      dataLines[lineNum - 1].collapsedLines = newCollapsedLines;
    } else {
      return;
    }

    const dataStringArray = dataLines.map((dataLine) => dataLine.value);
    const dataString = dataStringArray.join("\n");
    const jumpIndexes = computeJumpIndexes(data, dataLines);
    setActiveDataState({ data, dataString, jumpIndexes, dataLines }, () => {
      setSelectedJumpIndex(currentLineNum, () =>
        updateAdjacentJumpIndexes(currentLineNum, jumpIndexes)
      );
    });
  };

  const { prev, next } = adjacentJumpIndexes;

  return (
    <div className="json-viewer-container">
      <div className="json-viewer-action-buttons">
        <Popup
          content="Jump to previous section"
          trigger={
            <Button
              icon="arrow up"
              color="purple"
              disabled={prev <= 0 || isSearching}
              circular
              value={prev}
              onClick={handleArrowClick}
            />
          }
          position="top center"
          on="hover"
        />
        <Popup
          content="Jump to next section"
          trigger={
            <Button
              icon="arrow down"
              color="purple"
              disabled={next >= Number.MAX_SAFE_INTEGER || isSearching}
              circular
              value={next}
              onClick={handleArrowClick}
            />
          }
          position="top center"
          on="hover"
        />
        <FilterButton
          filename={filename}
          applyFilter={() => setFiltering(true)}
        />
        <Popup
          content="Reset"
          trigger={
            <Button
              icon="undo"
              color="red"
              disabled={!activeFilter}
              onClick={() => setFiltering(false)}
            />
          }
          position="top center"
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
        scrollToLine={selectedJumpIndex}
        onRowClick={handleRowClick}
        activeSearch={setSearching}
      />
    </div>
  );
}

export default JsonViewer;

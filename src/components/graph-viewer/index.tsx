import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
} from "recharts";
import dayjs from "dayjs";
import "./index.scss";

type DataShape = {
  ts: number;
  processes: {
    [process: string]: [number, number];
  };
};

type Props = {
  data: DataShape[];
};

type UsageStatistics = {
  avgCpu: number;
  highestCpu: number;
  avgMemory: number;
  highestMemory: number;
};

type Occurrences = {
  [value: number]: number;
};

type OccurrencesStatistics = {
  value: number;
  numOccurrences: number;
}[];

type PercentileStatistics = {
  rangeValue: string;
  frequency: number;
}[];

const colors = [
  "#eb9a9a",
  "#7ba6f6",
  "#f9a836",
  "#a26dc5",
  "#218747",
  "#3d75ea",
  "#f76b41",
  "#ca3631",
];

function parseToOccurrencesStatistics(
  occurrences: Occurrences
): OccurrencesStatistics {
  const occurrencesStatistics = Object.entries(occurrences).map(
    ([value, numOccurrences]) => {
      return {
        value: parseFloat(value),
        numOccurrences,
      };
    }
  );

  return occurrencesStatistics.sort((a, b) => a.value - b.value);
}

function computeOccurrencesStatistics(parsedData: DataShape[]) {
  const cpuUsageOccurrences: Occurrences = {};
  const memoryUsageOccurrences: Occurrences = {};

  parsedData.forEach((dataPoint) => {
    const [cpuUsage, memoryUsage] = dataPoint.processes.Total;

    cpuUsageOccurrences[cpuUsage] = (cpuUsageOccurrences[cpuUsage] ?? 0) + 1;
    memoryUsageOccurrences[memoryUsage] =
      (memoryUsageOccurrences[memoryUsage] ?? 0) + 1;
  });

  const cpuOccurrencesStatistics = parseToOccurrencesStatistics(
    cpuUsageOccurrences
  );
  const memoryOccurrencesStatistics = parseToOccurrencesStatistics(
    memoryUsageOccurrences
  );

  return {
    cpuOccurrencesStatistics,
    memoryOccurrencesStatistics,
  };
}

function computePercentileStatistics(
  occurrencesStatistics: OccurrencesStatistics,
  totalOccurrences: number,
  minValue?: number,
  maxValue?: number
) {
  minValue = ~~(minValue ?? occurrencesStatistics[0].value ?? 0);
  maxValue = Math.ceil(
    maxValue ??
      occurrencesStatistics[occurrencesStatistics.length - 1].value ??
      0
  );

  const interval = Math.ceil((maxValue - minValue) / 10);
  let percentileStatistics: PercentileStatistics = [];

  let start = minValue;
  let end = start + interval;
  let accumulatedNumOccurrences = 0;

  occurrencesStatistics.forEach(({ value, numOccurrences }) => {
    if (value <= end) {
      accumulatedNumOccurrences += numOccurrences;
    } else {
      // save statistics
      const rangeValue = `${start}-${end}`;
      const frequency =
        Math.round((accumulatedNumOccurrences / totalOccurrences) * 100) / 100;
      percentileStatistics.push({ rangeValue, frequency });

      // move to the next interval window
      start = end;
      end = start + interval;
      accumulatedNumOccurrences = numOccurrences;
    }
  });

  if (accumulatedNumOccurrences > 0) {
    const rangeValue = `${start}-${end}`;
    const frequency =
      Math.round((accumulatedNumOccurrences / totalOccurrences) * 100) / 100;
    percentileStatistics.push({ rangeValue, frequency });
  }

  return percentileStatistics;
}

function GraphViewer({ data }: Props) {
  const [processes, setProcesses] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<DataShape[]>([]);
  const [usageStatistics, setUsageStatistics] = useState<UsageStatistics>({
    avgCpu: 0,
    highestCpu: 0,
    avgMemory: 0,
    highestMemory: 0,
  });
  const [cpuPercentileStatistics, setCpuPercentileStatistics] = useState<
    PercentileStatistics
  >([]);
  const [memoryPercentileStatistics, setMemoryPercentileStatistics] = useState<
    PercentileStatistics
  >([]);
  const { avgCpu, highestCpu, avgMemory, highestMemory } = usageStatistics;

  useEffect(() => {
    let highestCpu = 0;
    let highestMemory = 0;
    let grandTotalCpu = 0;
    let grandTotalMemory = 0;

    // compute total field
    const parsedData = data.map(
      (entry): DataShape => {
        let totalCpu = 0;
        let totalMemory = 0;
        const currentProcesses = entry.processes;
        Object.values(currentProcesses).forEach(([cpu, memory]) => {
          totalCpu += cpu;
          totalMemory += memory;
        });

        totalMemory = Math.round(totalMemory * 10) / 10;

        highestCpu = Math.max(highestCpu, totalCpu);
        highestMemory = Math.max(highestMemory, totalMemory);
        grandTotalCpu += totalCpu;
        grandTotalMemory += totalMemory;

        return {
          ...entry,
          processes: {
            Total: [totalCpu, totalMemory],
            ...currentProcesses,
          },
        };
      }
    );

    setParsedData(parsedData);

    // compute processes
    const lastEntryProcesses = parsedData.slice(-1).pop()?.["processes"];
    lastEntryProcesses && setProcesses(Object.keys(lastEntryProcesses));

    // compute and store highest and avg CPU/memory usages
    const numDataPoints = parsedData.length;
    const avgCpu = grandTotalCpu / numDataPoints;
    const avgMemory = grandTotalMemory / numDataPoints;
    setUsageStatistics({ avgCpu, highestCpu, avgMemory, highestMemory });

    // compute percentile statistics
    const {
      cpuOccurrencesStatistics,
      memoryOccurrencesStatistics,
    } = computeOccurrencesStatistics(parsedData);

    const cpuPercentileStatistics = computePercentileStatistics(
      cpuOccurrencesStatistics,
      numDataPoints,
      0,
      100
    );
    const memoryPercentileStatistics = computePercentileStatistics(
      memoryOccurrencesStatistics,
      numDataPoints
    );

    setCpuPercentileStatistics(cpuPercentileStatistics);
    setMemoryPercentileStatistics(memoryPercentileStatistics);
  }, [data]);

  return (
    <div className="graph-viewer-container">
      <h2>CPU Usages</h2>
      <ResponsiveContainer height="20%">
        <AreaChart
          data={parsedData}
          syncId="usages"
          margin={{ top: 5, right: 5, bottom: 10, left: 20 }}
        >
          <XAxis
            dataKey="ts"
            type="number"
            domain={["dataMin", "dataMax"]}
            scale="time"
            label={{ value: "Timestamp", position: "insideBottom", offset: -5 }}
            allowDecimals={false}
            name="Timestamp"
          />
          <YAxis
            type="number"
            label={{
              value: "Total CPU Usage",
              position: "insideBottomLeft",
              angle: -90,
              offset: -10,
            }}
            allowDecimals={false}
            unit="%"
          />
          <Tooltip
            itemSorter={({ name }) => {
              return -processes.indexOf(name);
            }}
            labelFormatter={(label) => (
              <>
                {label}
                <br />
                {dayjs
                  .unix(parseInt(label.toString()))
                  .format("DD/MM HH:mm:ss")}
              </>
            )}
          />
          <ReferenceLine
            y={highestCpu}
            label="Max"
            stroke="#ca3631"
            strokeWidth="2"
            alwaysShow
          />
          <ReferenceLine
            y={avgCpu}
            label="Avg"
            stroke="#f76b41"
            strokeWidth="2"
            alwaysShow
          />
          {processes.map((process, index) => (
            <Area
              dataKey={`processes.${process}.0`}
              type="monotone"
              stroke={colors[index]}
              fill={colors[index]}
              stackId={process === "Total" ? undefined : "0"}
              unit="%"
              name={process}
              opacity={process === "Total" ? 0 : undefined}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      <h2>Memory Usages</h2>
      <ResponsiveContainer height="20%">
        <AreaChart
          data={parsedData}
          syncId="usages"
          margin={{ top: 5, right: 5, bottom: 10, left: 20 }}
        >
          <XAxis
            dataKey="ts"
            type="number"
            domain={["dataMin", "dataMax"]}
            scale="time"
            label={{ value: "Timestamp", position: "insideBottom", offset: -5 }}
            allowDecimals={false}
            name="Timestamp"
          />
          <YAxis
            type="number"
            label={{
              value: "Total Memory Usage",
              position: "insideBottomLeft",
              angle: -90,
              offset: -10,
            }}
            allowDecimals={false}
            unit="MB"
          />
          <Tooltip
            itemSorter={({ name }) => {
              return -processes.indexOf(name);
            }}
            labelFormatter={(label) => (
              <>
                {label}
                <br />
                {dayjs
                  .unix(parseInt(label.toString()))
                  .format("DD/MM HH:mm:ss")}
              </>
            )}
          />
          <ReferenceLine
            y={highestMemory}
            label="Max"
            strokeWidth="2"
            stroke="#ca3631"
            alwaysShow
          />
          <ReferenceLine
            y={avgMemory}
            label="Avg"
            strokeWidth="2"
            stroke="#f76b41"
            alwaysShow
          />
          {processes.map((process, index) => (
            <Area
              dataKey={`processes.${process}.1`}
              type="monotone"
              stroke={colors[index]}
              fill={colors[index]}
              stackId={process === "Total" ? undefined : "1"}
              unit="MB"
              name={process}
              opacity={process === "Total" ? 0 : undefined}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      <h2>CPU Usage Frequency</h2>
      <ResponsiveContainer height="20%">
        <BarChart
          data={cpuPercentileStatistics}
          margin={{ top: 5, right: 5, bottom: 10, left: 20 }}
        >
          <XAxis
            dataKey="rangeValue"
            label={{
              value: "CPU Usages",
              position: "insideBottom",
              offset: -5,
            }}
            allowDecimals={false}
            name="CPU Usages"
            unit="%"
          />
          <YAxis
            type="number"
            domain={[0, 1]}
            label={{
              value: "Frequency",
              position: "insideBottomLeft",
              angle: -90,
              offset: -10,
            }}
          />
          <Bar dataKey="frequency" fill="#8884d8" />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>

      <h2>Memory Usage Frequency</h2>
      <ResponsiveContainer height="20%">
        <BarChart
          data={memoryPercentileStatistics}
          margin={{ top: 5, right: 5, bottom: 10, left: 20 }}
        >
          <XAxis
            dataKey="rangeValue"
            label={{
              value: "Memory Usages",
              position: "insideBottom",
              offset: -5,
            }}
            allowDecimals={false}
            name="Memory Usages"
            unit="MB"
          />
          <YAxis
            type="number"
            domain={[0, 1]}
            label={{
              value: "Frequency",
              position: "insideBottomLeft",
              angle: -90,
              offset: -10,
            }}
          />
          <Bar dataKey="frequency" fill="#8884d8" />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraphViewer;

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
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

function GraphViewer({ data }: Props) {
  const [processes, setProcesses] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<DataShape[]>([]);
  const [usageStatistics, setUsageStatistics] = useState<UsageStatistics>({
    avgCpu: 0,
    highestCpu: 0,
    avgMemory: 0,
    highestMemory: 0,
  });
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
  }, [data]);

  console.log(processes);
  return (
    <div className="graph-viewer-container">
      <h2>CPU Usages</h2>
      <ResponsiveContainer height="40%">
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
      <ResponsiveContainer height="40%">
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
    </div>
  );
}

export default GraphViewer;

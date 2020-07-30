import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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

const colors = [
  "#eb9a9a",
  "#7ba6f6",
  "#f9a836",
  "#a26dc5",
  "#218747",
  "#f76b41",
  "#3d75ea",
  "#ca3631",
];

function GraphViewer({ data }: Props) {
  const [processes, setProcesses] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<DataShape[]>([]);

  useEffect(() => {
    // add total field
    const parsedData = data.map(
      (entry): DataShape => {
        let totalCpu = 0;
        let totalMemory = 0;
        const currentProcesses = entry.processes;
        Object.values(currentProcesses).forEach(([cpu, memory]) => {
          totalCpu += cpu;
          totalMemory += memory;
        });

        return {
          ...entry,
          processes: {
            Total: [totalCpu, Math.round(totalMemory * 10) / 10],
            ...currentProcesses,
          },
        };
      }
    );

    const lastEntryProcesses = parsedData.slice(-1).pop()?.["processes"];
    lastEntryProcesses && setProcesses(Object.keys(lastEntryProcesses));
    setParsedData(parsedData);
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

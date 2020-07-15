import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./index.scss";

type Props = {
  data: any[];
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
  const [processes, setProcesses] = useState<any[]>([]);

  useEffect(() => {
    const lastEntryProcesses = data.slice(-1).pop()?.["processes"];
    lastEntryProcesses && setProcesses(Object.entries(lastEntryProcesses));
  }, [data]);

  console.log(data);
  return (
    <div className="graph-viewer-container">
      <h2>CPU Usages</h2>
      <ResponsiveContainer height="40%">
        <AreaChart
          data={data}
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
          <Tooltip />
          {processes.map(([process], index) => (
            <Area
              dataKey={`processes.${process}.0`}
              type="monotone"
              stroke={colors[index]}
              fill={colors[index]}
              stackId="0"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <h2>Memory Usages</h2>
      <ResponsiveContainer height="40%">
        <AreaChart
          data={data}
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
          <Tooltip />
          {processes.map(([process], index) => (
            <Area
              dataKey={`processes.${process}.1`}
              type="monotone"
              stroke={colors[index]}
              fill={colors[index]}
              stackId="1"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraphViewer;

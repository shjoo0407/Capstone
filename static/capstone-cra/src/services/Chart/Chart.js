import React from "react";
// import { Link } from "react-router-dom";
import { ResponsiveLine } from "@nivo/line";

const data = [
  {
    id: "칼로리",
    color: "hsl(180, 70%, 50%)",
    data: [
      {
        x: "2023/05/11",
        y: 1800,
      },
      {
        x: "2023/05/12",
        y: 2004,
      },
      {
        x: "2023/05/13",
        y: 1792,
      },
      {
        x: "2023/05/14",
        y: 920,
      },
      {
        x: "2023/05/15",
        y: 880,
      },
      {
        x: "2023/05/16",
        y: 1430,
      },
      {
        x: "2023/05/17",
        y: 1087,
      },
    ],
  },
  {
    id: "탄수화물",
    color: "hsl(302, 70%, 50%)",
    data: [
      {
        x: "2023/05/11",
        y: 789,
      },
      {
        x: "2023/05/12",
        y: 622,
      },
      {
        x: "2023/05/13",
        y: 416,
      },
      {
        x: "2023/05/14",
        y: 745,
      },
      {
        x: "2023/05/15",
        y: 720,
      },
      {
        x: "2023/05/16",
        y: 919,
      },
      {
        x: "2023/05/17",
        y: 781,
      },
    ],
  },
  {
    id: "단백질",
    color: "hsl(95, 70%, 50%)",
    data: [
      {
        x: "2023/05/11",
        y: 208,
      },
      {
        x: "2023/05/12",
        y: 102,
      },
      {
        x: "2023/05/13",
        y: 186,
      },
      {
        x: "2023/05/14",
        y: 145,
      },
      {
        x: "2023/05/15",
        y: 180,
      },
      {
        x: "2023/05/16",
        y: 109,
      },
      {
        x: "2023/05/17",
        y: 184,
      },
    ],
  },
  {
    id: "지방",
    color: "hsl(161, 70%, 50%)",
    data: [
      {
        x: "2023/05/11",
        y: 308,
      },
      {
        x: "2023/05/12",
        y: 262,
      },
      {
        x: "2023/05/13",
        y: 416,
      },
      {
        x: "2023/05/14",
        y: 145,
      },
      {
        x: "2023/05/15",
        y: 280,
      },
      {
        x: "2023/05/16",
        y: 309,
      },
      {
        x: "2023/05/17",
        y: 284,
      },
    ],
  },
];

const MyResponsiveLine = ({ data }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: false,
      reverse: false,
    }}
    yFormat=" >-.2f"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      // legend: "transportation",
      legendOffset: 36,
      legendPosition: "middle",
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "kcal",
      legendOffset: -40,
      legendPosition: "middle",
    }}
    pointSize={10}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabelYOffset={-12}
    useMesh={true}
    legends={[
      {
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: "left-to-right",
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "hover",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);

export default function Chart() {
  return (
    <div style={{ height: 500, width: 1200 }}>
      <MyResponsiveLine data={data} />
    </div>
  );
}

import React from "react";
// import { Link } from "react-router-dom";
import { ResponsiveLine } from "@nivo/line";

const MyResponsiveLine1 = ({ data }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: 0,
      max: "auto",
      stacked: false,
      reverse: false,
    }}
    yFormat=" >-.2f"
    axisTop={null}
    axisRight={null}
    axisBottom={null}
    enablePoints={false}
    enableGridX={false}
    //    axisBottom={{
    //      tickSize: 5,
    //      tickPadding: 5,
    //      tickRotation: 0,
    //      // legend: "transportation",
    //      legendOffset: 36,
    //      legendPosition: "middle",
    //    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "kcal or g",
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

const MyResponsiveLine2 = ({ data }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: 0,
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
      legendOffset: 36,
      legendPosition: "middle",
    }}
    //    axisBottom={{
    //      tickSize: 5,
    //      tickPadding: 5,
    //      tickRotation: 0,
    //      // legend: "transportation",
    //      legendOffset: 36,
    //      legendPosition: "middle",
    //    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "kcal or g",
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

function Chart({ data, over3Month }) {
  const overMonth = over3Month;
  console.log("overMonth: ", overMonth);
  const statsData = [
    {
      id: "칼로리",
      color: "hsl(180, 70%, 50%)",
      data: data.kcal,
    },
    {
      id: "탄수화물",
      color: "hsl(302, 70%, 50%)",
      data: data.carbon,
    },
    {
      id: "단백질",
      color: "hsl(95, 70%, 50%)",
      data: data.pro,
    },
    {
      id: "지방",
      color: "hsl(161, 70%, 50%)",
      data: data.fat,
    },
  ];

  return (
    <div style={{ height: 500, width: 1200 }}>
      {overMonth === true && <MyResponsiveLine1 data={statsData} />}
      {overMonth === false && <MyResponsiveLine2 data={statsData} />}
    </div>
  );
}

export default Chart;

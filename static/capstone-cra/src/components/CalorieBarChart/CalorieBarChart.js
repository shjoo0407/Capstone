import React, { useEffect, useState } from "react";
import "../../styles/reset.css";
import "./CalorieBarChart.css";

function CalorieBarChart({ width, percent, color }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(percent * width);
    console.log(value);
  });

  const style = {
    width: `${value}px`,
    backgroundColor: color,
  };
  return (
    <div className="progress-bar" style={{ width: `${width}px` }}>
      <div className="progress" style={style}></div>
    </div>
  );
}

export default CalorieBarChart;

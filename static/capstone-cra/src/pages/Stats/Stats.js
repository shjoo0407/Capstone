import React from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./Stats.css";
import HeaderNav from "../../components/Header/HeaderNav";
import { Link, useParams } from "react-router-dom";

import Chart from "../../services/Chart/Chart";

function Stats() {
  return (
    <div>
      <HeaderNav />
      <div class="main stats-main">
        <div class="common-inner main-content stats-content">
          <div className="chart-nav">
            <button className="chart-btn">일주일</button>
            <button className="chart-btn">1달</button>
            <button className="chart-btn">3달</button>
            <button className="chart-btn">1년</button>
          </div>
          <Chart />
        </div>
      </div>
    </div>
  );
}
export default Stats;

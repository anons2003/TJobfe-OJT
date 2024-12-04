import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./featured.scss";

const Featured = () => {
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [target, setTarget] = useState(10000); // Example target value

  useEffect(() => {
    const fetchDailyRevenue = async () => {
      try {
        const response = await axios.get('https://topjob-ojt-790cf940c139.herokuapp.com/transactions/daily-revenue');
        setDailyRevenue(response.data);
      } catch (error) {
        console.error('Error fetching daily revenue:', error.message);
      }
    };

    const fetchWeeklyRevenue = async () => {
      try {
        const response = await axios.get('https://topjob-ojt-790cf940c139.herokuapp.com/transactions/weekly-revenue');
        setWeeklyRevenue(response.data);
      } catch (error) {
        console.error('Error fetching weekly revenue:', error.message);
      }
    };

    const fetchMonthlyRevenue = async () => {
      try {
        const response = await axios.get('https://topjob-ojt-790cf940c139.herokuapp.com/transactions/monthly-revenue');
        setMonthlyRevenue(response.data);
      } catch (error) {
        console.error('Error fetching monthly revenue:', error.message);
      }
    };

    fetchDailyRevenue();
    fetchWeeklyRevenue();
    fetchMonthlyRevenue();
  }, []);

  // Calculate percentage of daily revenue compared to target
  const dailyProgress = (dailyRevenue / target) * 100;

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Revenue</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar value={dailyProgress} text={`${dailyProgress.toFixed(0)}%`} strokeWidth={5} />
        </div>
        <p className="title">Total sales made today</p>
        <p className="amount">${dailyRevenue}</p>
        <p className="desc">
          Previous transactions processing. Last payments may not be included.
        </p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Target</div>
            <div className="itemResult negative">

              <div className="resultAmount">${target}</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Week</div>
            <div className="itemResult positive">

              <div className="resultAmount">${weeklyRevenue}</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Month</div>
            <div className="itemResult positive">

              <div className="resultAmount">${monthlyRevenue}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
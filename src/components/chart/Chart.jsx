import "./chart.scss";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from 'react';
import axios from 'axios';

const Chart = ({ aspect, title }) => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchJobPostsStatistics = async () => {
      try {
  
        const response = await axios.get(`http://localhost:8080/jobs/monthly-job-posts?year=${year}`);
        console.log(response.data)
        const transformedData = transformData(response.data); 
        setData(transformedData); 
      } catch (error) {
        console.error('Error fetching job statistics:', error); 
      }
    };

    fetchJobPostsStatistics();
  }, [year]); 

  const transformData = (data) => {
  
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    return data.map(item => ({
      name: months[item.month - 1],
      TotalJobs: item.jobCount 
    }));
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  return (
    <div className="chart">
      <div className="title">
        {title}
        <select value={year} onChange={handleYearChange}>
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i} value={new Date().getFullYear() - i}>
              {new Date().getFullYear() - i}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <BarChart
          data={data} 
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="totalJobs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" /> 
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" /> 
          <Tooltip /> 
          <Bar
            dataKey="TotalJobs"
            fill="url(#totalJobs)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;

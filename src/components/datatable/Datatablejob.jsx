import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import './datatablejobmodaration.scss';

// Cấu hình cột cho bảng công việc
export const jobColumns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'Title', width: 200 },
  { field: 'skills', headerName: 'Skills', width: 300 },
  { field: 'experience', headerName: 'Experience', width: 150 },
  { field: 'salaryType', headerName: 'Salary Type', width: 150 },
  { field: 'minSalary', headerName: 'Min Salary', width: 150 },
  { field: 'maxSalary', headerName: 'Max Salary', width: 150 },
  { field: 'isActive', headerName: 'Active Status', width: 150 },
  {
    field: 'action',
    headerName: 'Action',
    width: 150,
    renderCell: (params) => (
      <div className="cellAction">
        <Link to={`/jobs/jobPosts/view/${params.row.id}`} style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary" className="viewButton">
            View
          </Button>
        </Link>
      </div>
    ),
  },
];

const Datatablejob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://topjob-ojt-790cf940c139.herokuapp.com/jobs/list');
        setJobs(transformData(response.data));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const transformData = (data) => {
    return data.map((job) => ({
      id: job.id,
      title: job.title,
      skills: job.skills,
      experience: job.experience,
      salaryType: job.salaryType,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      isActive: job.isActive ? 'Active' : 'Inactive',
    }));
  };

  return (
    <div className="datatable">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <DataGrid
          className="datagrid"
          rows={jobs}
          columns={jobColumns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      )}
    </div>
  );
};

export default Datatablejob;
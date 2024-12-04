import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/SidebarA';
import Navbar from '../../components/navbar/Navbar';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import './singleJobPosts.scss';

const SingleJobPostsModeration = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Use navigate hook for redirection
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disableButtons, setDisableButtons] = useState(false);
  const [selectedRejectReasons, setSelectedRejectReasons] = useState([]);
  const [otherReason, setOtherReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/jobs/view/${id}`);
        setJob(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApproval = async () => {
    setDisableButtons(true);
    try {
      const response = await axios.patch(`http://localhost:8080/jobs/approval/${id}`, { isActive: true });
      if (response.status === 200) {
        setJob((prevJob) => ({ ...prevJob, isActive: true }));
        setSuccessMessage('Job approval successful.');
        // Redirect to the job posts list page
        setTimeout(() => {
          navigate('/jobs/jobPosts');
        }, 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      console.error('Error updating job status:', error.message);
    }
  };

  const handleReject = async () => {
    if (selectedRejectReasons.length === 0) {
      alert('Please select at least one reason for rejection.');
      return;
    }

    setDisableButtons(true);
    try {
      const rejectionData = {
        rejectReasons: selectedRejectReasons,
        otherReason: selectedRejectReasons.includes('Other') ? otherReason : '',
      };

      const response = await axios.patch(`http://localhost:8080/jobs/rejection/${id}`, rejectionData);
      if (response.status === 200) {
        setJob((prevJob) => ({ ...prevJob, isActive: false }));
        setSuccessMessage('Job rejection successful.');
        // Redirect to the job moderation list page
        setTimeout(() => {
          navigate('/jobs/jobPostsModerations');
        }, 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      console.error('Error rejecting job:', error.message);
    }
  };

  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    if (selectedRejectReasons.includes(value)) {
      setSelectedRejectReasons(selectedRejectReasons.filter((reason) => reason !== value));
    } else {
      setSelectedRejectReasons([...selectedRejectReasons, value]);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <h1>Job Post Review</h1>
            <div className="jobDetails">
              <h2>{job.title}</h2>
              <div className="jobInfo">
                <p><strong>Enterprise:</strong> {job.enterprise.enterprise_name}</p>
                <p><strong>Description:</strong> {job.description}</p>
                <p><strong>Skills:</strong> {job.skills}</p>
                <p><strong>Salary:</strong> {job.minSalary} - {job.maxSalary}</p>
                <p><strong>Salary Type:</strong> {job.salaryType}</p>
                <p><strong>Location:</strong> {job.address}, {job.state}, {job.country}</p>
                <p><strong>Experience:</strong> {job.experience}</p>
                <p><strong>Created At:</strong> {job.createdAt}</p>
                <p><strong>Qualifications:</strong> {job.qualifications}</p>
                <p><strong>Industry:</strong> {job.industry}</p>
                <p><strong>Active Status:</strong> {job.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <h2>Contact Information</h2>
              <div className="contactInfo">
                <p><strong>Enterprise:</strong> {job.enterprise.enterprise_name}</p>
                <p><strong>Enterprise User:</strong> {job.enterprise.user.user_name} ({job.enterprise.user.email})</p>
                <p><strong>Founder:</strong> {job.enterprise.founder}</p>
                <p><strong>Enterprise Email:</strong> {job.enterprise.user.email}</p>
                <p><strong>Phone:</strong> {job.enterprise.phone}</p>
                <p><strong>Headquarter:</strong> {job.enterprise.headquarter}</p>
                <p><strong>Founded:</strong> {job.enterprise.founded}</p>
              </div>
            </div>
            <div className="actionButtons">
              <Button
                variant="contained"
                color="success"
                onClick={handleApproval}
                disabled={disableButtons}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleReject}
                disabled={disableButtons}
              >
                Reject
              </Button>
            </div>
            <FormControl component="fieldset" className="rejectReasons">
              <FormGroup>
                <p>Please select reasons for rejection:</p>
                <FormControlLabel
                  control={<Checkbox checked={selectedRejectReasons.includes('Violating the law')} onChange={handleCheckboxChange} value="Violating the law" />}
                  label="Violating the law"
                />
                <FormControlLabel
                  control={<Checkbox checked={selectedRejectReasons.includes('Inappropriate job description')} onChange={handleCheckboxChange} value="Inappropriate job description" />}
                  label="Inappropriate job description"
                />
                <FormControlLabel
                  control={<Checkbox checked={selectedRejectReasons.includes('Incomplete information')} onChange={handleCheckboxChange} value="Incomplete information" />}
                  label="Incomplete information"
                />
                <FormControlLabel
                  control={<Checkbox checked={selectedRejectReasons.includes('Cheat')} onChange={handleCheckboxChange} value="Cheat" />}
                  label="Cheat"
                />
                <FormControlLabel
                  control={<Checkbox checked={selectedRejectReasons.includes('Limiting candidates\' benefits')} onChange={handleCheckboxChange} value="Limiting candidates\' benefits" />}
                  label="Limiting candidates' benefits"
                />
                <FormControlLabel
                  control={<Checkbox checked={selectedRejectReasons.includes('Other')} onChange={handleCheckboxChange} value="Other" />}
                  label="Other"
                />
                {selectedRejectReasons.includes('Other') && (
                  <TextField
                    id="other-reason"
                    label="Other reason"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    fullWidth
                  />
                )}
              </FormGroup>
            </FormControl>
          </div>
        </div>
      </div>
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default SingleJobPostsModeration;
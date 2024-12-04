import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar/SidebarA';
import Navbar from '../../components/navbar/Navbar';
import './singleJobPosts.scss';
import { useNavigate } from 'react-router-dom';

const SingleJobPosts = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const navigate = useNavigate();  

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
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/jobs/delete/${id}`);
      console.log(response.data);
      setDeleteMessage('Job deleted successfully!');
      window.alert("Job deleted successfully!");  // Hiển thị alert thông báo thành công
      setTimeout(() => {
        navigate('/jobs/jobPosts');  // Redirect after 2 seconds
      }, 1000);
    } catch (error) {
      console.error('Error deleting job:', error);
      setDeleteMessage('Failed to delete the job. Please try again later.');
      window.alert("Failed to delete the job. Please try again later.");  // Hiển thị alert thông báo thất bại
    }
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
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src={job.enterprise.avatar_url}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{job.title}</h1>
                <div className="detailItem">
                  <span className="itemKey">Enterprise: </span>
                  <span className="itemValue">{job.enterprise.enterprise_name}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Salary: </span>
                  <span className="itemValue">{job.minSalary} - {job.maxSalary}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Location: </span>
                  <span className="itemValue">{job.address}, {job.state}, {job.country}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Experience: </span>
                  <span className="itemValue">{job.experience}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Created At: </span>
                  <span className="itemValue">{job.createdAt}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Skills: </span>
                  <span className="itemValue">{job.skills}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Qualifications: </span>
                  <span className="itemValue">{job.qualifications}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Industry: </span>
                  <span className="itemValue">{job.industry}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Company Story: </span>
                  <span className="itemValue">{job.enterprise.companyStory}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Founder: </span>
                  <span className="itemValue">{job.enterprise.founder}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Web URL: </span>
                  <span className="itemValue"><a href={job.enterprise.web_url} target="_blank" rel="noopener noreferrer">{job.enterprise.web_url}</a></span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone: </span>
                  <span className="itemValue">{job.enterprise.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Headquarter: </span>
                  <span className="itemValue">{job.enterprise.headquarter}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Founded: </span>
                  <span className="itemValue">{job.enterprise.founded}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Resume URL: </span>
                  <span className="itemValue"><a href={job.enterprise.resume_url} target="_blank" rel="noopener noreferrer">{job.enterprise.resume_url}</a></span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Enterprise User: </span>
                  <span className="itemValue">{job.enterprise.user.user_name} ({job.enterprise.user.email})</span>
                </div>

                {/* Delete Button */}
                <button 
  onClick={handleDelete} 
  style={{
    backgroundColor: '#f44336',    
    padding: '10px 20px',        
    border: 'none',             
  }}
>
  Delete Job
</button>
{deleteMessage && <p className="deleteMessage">{deleteMessage}</p>}  {/* Hiển thị thông báo xoá */}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleJobPosts;
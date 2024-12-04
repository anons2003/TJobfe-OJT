import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from "../../components/sidebar/SidebarA";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import "./single.scss";

const SingleJobSeeker = () => {
    const { id } = useParams();
    const [jobSeeker, setJobSeeker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobSeeker = async () => {
            try {
                const response = await fetch(`https://topjob-ojt-790cf940c139.herokuapp.com/job-seekers/view/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch job seeker');
                }
                const data = await response.json();
                setJobSeeker(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJobSeeker();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <h1 className="title">Job Seeker Information</h1>
                        <div className="item">
                            <div className="details">
                                <h1 className="itemTitle">{jobSeeker.first_name} {jobSeeker.last_name}</h1>
                                <div className="detailItem">
                                    <span className="itemKey">User Name:</span>
                                    <span className="itemValue">{jobSeeker.user.user_name}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Email:</span>
                                    <span className="itemValue">{jobSeeker.user.email}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Phone:</span>
                                    <span className="itemValue">{jobSeeker.phone}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Occupation:</span>
                                    <span className="itemValue">{jobSeeker.occupation}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Date of Birth:</span>
                                    <span className="itemValue">{new Date(jobSeeker.dob).toLocaleDateString()}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Gender:</span>
                                    <span className="itemValue">{jobSeeker.gender === 1 ? 'Male' : 'Female'}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">City:</span>
                                    <span className="itemValue">{jobSeeker.city}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">State:</span>
                                    <span className="itemValue">{jobSeeker.state}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Website:</span>
                                    <span className="itemValue"><a href={jobSeeker.web_url} target="_blank" rel="noopener noreferrer">{jobSeeker.web_url}</a></span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Resume:</span>
                                    <span className="itemValue"><a href={jobSeeker.resume_url} target="_blank" rel="noopener noreferrer">View Resume</a></span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Introduction:</span>
                                    <span className="itemValue">{jobSeeker.intro}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Active Status:</span>
                                    <span className="itemValue">{jobSeeker.user.isActive ? 'Active' : 'Inactive'}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Account Balance:</span>
                                    <span className="itemValue">${jobSeeker.user.account_balance}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Role Type:</span>
                                    <span className="itemValue">{jobSeeker.user.roleType.roleTypeName}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Registration Date:</span>
                                    <span className="itemValue">{new Date(jobSeeker.user.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SingleJobSeeker;
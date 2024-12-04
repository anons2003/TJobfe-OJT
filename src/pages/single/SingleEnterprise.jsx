import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from "../../components/sidebar/SidebarA";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import "./single.scss";

const SingleEnterprise = () => {
    const { id } = useParams();
    const [enterprise, setEnterprise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnterprise = async () => {
            try {
                const response = await fetch(`https://topjob-ojt-790cf940c139.herokuapp.com/enterprises/view/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch enterprise');
                }
                const data = await response.json();
                setEnterprise(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEnterprise();
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
                        <h1 className="title">Enterprise Information</h1>
                        <div className="item">

                            <div className="details">
                                <h1 className="itemTitle">{enterprise.enterprise_name}</h1>
                                <div className="detailItem">
                                    <span className="itemKey">Founder:</span>
                                    <span className="itemValue">{enterprise.founder}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Phone:</span>
                                    <span className="itemValue">{enterprise.phone}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">City:</span>
                                    <span className="itemValue">{enterprise.city}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">State:</span>
                                    <span className="itemValue">{enterprise.state}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Website:</span>
                                    <span className="itemValue"><a href={enterprise.web_url} target="_blank" rel="noopener noreferrer">{enterprise.web_url}</a></span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Resume:</span>
                                    <span className="itemValue"><a href={enterprise.resume_url} target="_blank" rel="noopener noreferrer">View Resume</a></span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Headquarter:</span>
                                    <span className="itemValue">{enterprise.headquarter}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Founded:</span>
                                    <span className="itemValue">{enterprise.founded}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Company Story:</span>
                                    <span className="itemValue">{enterprise.companyStory}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Active Status:</span>
                                    <span className="itemValue">{enterprise.user.isActive ? 'Active' : 'Inactive'}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Account Balance:</span>
                                    <span className="itemValue">${enterprise.user.account_balance}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Role Type:</span>
                                    <span className="itemValue">{enterprise.user.roleType.roleTypeName}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Registration Date:</span>
                                    <span className="itemValue">{new Date(enterprise.user.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SingleEnterprise;
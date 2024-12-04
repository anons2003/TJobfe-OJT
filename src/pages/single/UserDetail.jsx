import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from "../../components/sidebar/SidebarA";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import "./single.scss";

const UserDetail = () => {
  const { jid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("jid:", jid); // Debugging line

    if (!jid) {
      setError("User ID is missing");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8080/jobSeeker/candidate-profile/${jid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [jid]);

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
            <h1 className="title">User Information</h1>
            <div className="item">
              <img
                src={user.avatar_url || "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{user.user.user_name}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{user.user.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{user.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Gender:</span>
                  <span className="itemValue">{user.gender ? 'Male' : 'Female'}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Date of birth:</span>
                  <span className="itemValue">{user.dob}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Email Verified:</span>
                  <span className="itemValue">{user.user.is_verify_email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Role:</span>
                  <span className="itemValue">{user.user.roleType.roleTypeName}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Date Created:</span>
                  <span className="itemValue">{new Date(user.user.created_at).toLocaleDateString()}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Date Updated:</span>
                  <span className="itemValue">{new Date(user.user.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Redeem Points:</span>
                  <span className="itemValue">{user.redem_point}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Status:</span>
                  <span className="itemValue">{user.user.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">About:</span>
                  <span className="itemValue">{user.about}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={1.7 / 1} title="User Spending (Last 6 Months)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

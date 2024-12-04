import "./sidebarA.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";

import StoreIcon from "@mui/icons-material/Store";
import ExtensionIcon from '@mui/icons-material/Extension';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FeedIcon from '@mui/icons-material/Feed';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';

import { Link, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useState } from "react";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import GroupIcon from '@mui/icons-material/Group';

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const [manageUsersOpen, setManageUsersOpen] = useState(false);
  const [manageJobPostsOpen, setManageJobPostsOpen] = useState(false);
  const navigate = useNavigate();

  const handleManageUsersClick = () => {
    setManageUsersOpen(!manageUsersOpen);
    setManageJobPostsOpen(false); // Close Manage Job Posts menu
  };

  const handleManageJobPostsClick = () => {
    setManageJobPostsOpen(!manageJobPostsOpen);
    setManageUsersOpen(false); // Close Manage Users menu
  };

  return (
    <div className="sidebarA">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Welcome Admin</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <ul class="dashboard">
            <Link to="/admin/dashboard" style={{ textDecoration: "none" }}>
              <DashboardIcon className="icon" />
              <span> Dashboard</span>
            </Link>
          </ul>

          <p className="title">LISTS</p>

          <ul onClick={handleManageUsersClick}>
            <ManageAccountsIcon className="icon" />
            <span>   Manage Users   </span>
            {manageUsersOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ul>

          {manageUsersOpen && (
            <ul className="sub-menu">
              <li>
                <Link to="/users/job-seekers" style={{ textDecoration: "none" }}>
                  <PersonSearchIcon className="icon" />
                  <span>  Job Seeker</span>
                </Link>
              </li>

              <li>
                <Link to="/users/enterprises" style={{ textDecoration: "none" }}>
                  <GroupIcon className="icon" />
                  <span>   Enterprise</span>
                </Link>
              </li>

              {/* <li>
                <Link to="/users/admins" style={{ textDecoration: "none" }}>
                  <AdminPanelSettingsIcon className="icon" />
                  <span>   Admin</span>
                </Link>
              </li> */}
            </ul>
          )}

          <ul onClick={handleManageJobPostsClick}>
            <StoreIcon className="icon" />
            <span>  Manage Job Posts</span>
            {manageJobPostsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ul>

          {manageJobPostsOpen && (
            <ul className="sub-menu">
              <li>
                <Link to="/jobs/jobPosts" style={{ textDecoration: "none" }}>
                  <StoreIcon className="icon" />
                  <span>   List Job Posts</span>
                </Link>
              </li>
              <li>
                <Link to="/jobs/jobPostsModerations" style={{ textDecoration: "none" }}>
                  <StoreIcon className="icon" />
                  <span>   Approval Job Posts</span>
                </Link>
              </li>
            </ul>
          )}
          <Link to="/blogs" style={{ textDecoration: "none" }}>
            <ul>
              <FeedIcon className="icon" />
              <span>   Blog</span>
            </ul>
          </Link>
          <Link to="/transactions" style={{ textDecoration: "none" }}>
            <ul>
              <AccountBalanceWalletIcon className="icon" />
              <span>   Transactions</span>
            </ul>
          </Link>
          <Link to="/packageServices" style={{ textDecoration: "none" }}>
            <ul>
              <ExtensionIcon className="icon" />
              <span>   Package Services</span>
            </ul>
          </Link>
         
          {/* <Link to="/statistic" style={{ textDecoration: "none" }}>
            <ul>
              <AnalyticsIcon className="icon" />
              <span>   Statistic</span>
            </ul>
          </Link> */}
          
          {/* <Link to="/statistic" style={{ textDecoration: "none" }}>
            <ul>
              <ExtensionIcon className="icon" />
              <span>  Statistic</span>
            </ul>
          </Link> */}
          <Link to="/create-template" style={{ textDecoration: "none" }}>
            <ul>
              <InsertInvitationIcon className="icon" />
              <span>   Create template</span>
            </ul>
          </Link>

          <li>
            <ExitToAppIcon className="icon" />
            <span onClick={() => {
              sessionStorage.clear();
              navigate("/");
              window.location.reload();
            }}
            >Log out</span>
          </li>

        </ul>
      </div>
    </div >
  );
};

export default Sidebar;
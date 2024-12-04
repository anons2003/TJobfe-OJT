import "./single.scss";
import Sidebar from "../../components/sidebar/SidebarA";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";

const Single = () => {
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
                src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">Jane Doe</h1>
                <div className="detailItem">
                  <span className="itemKey">User Name:</span>
                  <span className="itemValue">Jane123</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">janedoe@gmail.com</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">+1 2345 67 89</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Tax code :</span>
                  <span className="itemValue">123213123</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Date Created : </span>
                  <span className="itemValue">20/10/2023</span>
                </div>
                
                <div className="detailItem">
                  <span className="itemKey">Status : </span>
                  <span className="itemValue">Active </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Role : </span>
                  <span className="itemValue">User </span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={2 / 1} title="User Spending ( Last 6 Months)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;

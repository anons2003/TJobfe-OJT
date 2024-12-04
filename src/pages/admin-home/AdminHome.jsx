import Sidebar from "../../components/sidebar/SidebarA";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";

const AdminHome = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="postjob" />
          <Widget type="earning" />
        </div>
        <div className="charts">
          {/* <Featured /> */}
        
          <Chart title="Job posts registration in 1 year    . " aspect={2.5 / 1} />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
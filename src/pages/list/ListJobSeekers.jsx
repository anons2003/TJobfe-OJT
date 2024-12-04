import "./list.scss"
import Sidebar from "../../components/sidebar/SidebarA"
import Navbar from "../../components/navbar/Navbar"
import DatatableJobSeeker from "../../components/datatable/DatatableJobSeeker"

const ListJobSeekers = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <DatatableJobSeeker />
      </div>
    </div>
  )
}

export default ListJobSeekers;
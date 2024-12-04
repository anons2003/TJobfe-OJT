import "./list.scss"
import Sidebar from "../../components/sidebar/SidebarA"
import Navbar from "../../components/navbar/Navbar"
import Datatablejobmoderation from "../../components/datatable/Datatablejobmoderation"

const ListJobPostsModeration = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <Datatablejobmoderation />
      </div>
    </div>
  )
}

export default ListJobPostsModeration;
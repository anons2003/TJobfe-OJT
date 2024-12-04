import "./list.scss"
import Sidebar from "../../components/sidebar/SidebarA"
import Navbar from "../../components/navbar/Navbar"
import Datatablejob from "../../components/datatable/Datatablejob"

const ListJobPosts = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <Datatablejob />
      </div>
    </div>
  )
}

export default ListJobPosts;
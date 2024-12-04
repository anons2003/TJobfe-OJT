import "./list.scss"
import Sidebar from "../../components/sidebar/SidebarA"
import Navbar from "../../components/navbar/Navbar"
import DatatableEnterprise from "../../components/datatable/DatatableEnterprise"

const ListUsers = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <DatatableEnterprise />
      </div>
    </div>
  )
}

export default ListUsers;
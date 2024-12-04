import "./list.scss"
import Sidebar from "../../components/sidebar/SidebarA"
import Navbar from "../../components/navbar/Navbar"
import DatatableAdmin from "../../components/datatable/DatatableAdmin"

const ListAdmins = () => {
    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <DatatableAdmin />
            </div>
        </div>
    )
}

export default ListAdmins;
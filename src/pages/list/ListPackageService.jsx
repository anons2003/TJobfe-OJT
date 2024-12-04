import "./list.scss"
import Sidebar from "../../components/sidebar/SidebarA"
import Navbar from "../../components/navbar/Navbar"
import DatatablePackageService from "../../components/datatable/DatatablePackageService"

const ListPackageService = () => {
    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <DatatablePackageService />
            </div>
        </div>
    )
}

export default ListPackageService;
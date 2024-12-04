import "./list.scss"
import Sidebar from "../../components/sidebar/SidebarA"
import Navbar from "../../components/navbar/Navbar"
import EditPackageService from "../editPackageService/EditPackageService"

const ListEditPackageService = () => {
    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <EditPackageService />
            </div>
        </div>
    )
}

export default ListEditPackageService;
import "./list.scss"
import Sidebar from "../../components/sidebar/SidebarA"
import Navbar from "../../components/navbar/Navbar"
import EditBlog from "../editPackageService/EditBlog"

const ListEditBlog = () => {
    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <EditBlog />
            </div>
        </div>
    )
}

export default ListEditBlog;
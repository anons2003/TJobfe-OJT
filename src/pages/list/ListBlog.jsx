import "./list.scss"
import Sidebar from "../../components/sidebar/SidebarA"
import Navbar from "../../components/navbar/Navbar"
import DatatableBlog from "../../components/datatable/DatatableBlog"

const ListBlog = () => {
    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <DatatableBlog />
            </div>
        </div>
    )
}

export default ListBlog;
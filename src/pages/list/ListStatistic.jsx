import "./list.scss"
import Sidebar from "../../components/sidebar/SidebarA"
import Navbar from "../../components/navbar/Navbar"

const ListStatistic = () => {
    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
            </div>
        </div>
    )
}

export default ListStatistic;
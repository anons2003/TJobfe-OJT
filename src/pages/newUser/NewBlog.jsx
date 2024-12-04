import "./new.scss";
import Sidebar from "../../components/sidebar/SidebarA";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const NewBlog = ({ title }) => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        author: "",
        imageUrl: "",
        isActive: true,
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate(); // Khởi tạo navigate

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("https://topjob-ojt-790cf940c139.herokuapp.com/blogs/create", formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Blog saved successfully:", response.data);
            setSuccessMessage("Blog saved successfully!");
            setError(null);
            // Clear form after successful submission (optional)
            setFormData({
                title: "",
                content: "",
                author: "",
                imageUrl: "",
                isActive: true,
            });

            // Chuyển hướng về trang /blogs sau khi gửi thành công
            navigate("/blogs");
        } catch (error) {
            console.error("There was an error saving the blog!", error);
            setSuccessMessage("");
            setError("Failed to create blog");
        }
    };

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <div className="right">
                        <form onSubmit={handleSubmit}>
                            <div className="formInput">
                                <label>Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="formInput">
                                <label>Content</label>
                                <textarea
                                    placeholder="Enter content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                    style={{ width: "100%", height: "200px" }} // Thêm width và height
                                />
                            </div>
                            <div className="formInput">
                                <label>Author</label>
                                <input
                                    type="text"
                                    placeholder="Enter author"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="formInput">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    placeholder="Enter image URL"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="formInput">
                                <label>Active</label>
                                <select
                                    name="isActive"
                                    value={formData.isActive}
                                    onChange={handleChange}
                                >
                                    <option value={true}>Active</option>
                                    <option value={false}>Inactive</option>
                                </select>
                            </div>
                            <button type="submit">Send</button>
                        </form>
                        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewBlog;

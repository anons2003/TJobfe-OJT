import "./new.scss";
import Sidebar from "../../components/sidebar/SidebarA";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import axios from "axios";

const NewJobSeeker = ({ title }) => {
    const [formData, setFormData] = useState({
        user_name: "",
        email: "",
        password: "",
        userTypeId: 1, // Giá trị mặc định cho Job Seeker
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData); // In ra formData để kiểm tra

        try {
            const response = await axios.post("http://localhost:8080/signup", formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("User saved successfully:", response.data);
            setSuccessMessage("User saved successfully!");
            setError(null);
        } catch (error) {
            console.error("There was an error saving the user!", error);
            setSuccessMessage("");
            setError("Failed to create user");
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
                                <label>Username</label>
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    name="user_name"
                                    value={formData.user_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="formInput">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="formInput">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="formInput">
                                <label>User Role</label>
                                <select
                                    name="userTypeId"
                                    value={formData.userTypeId}
                                    onChange={handleChange}
                                >
                                    <option value={1}>Job Seeker</option>
                                    <option value={2}>Enterprise</option>
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

export default NewJobSeeker;    
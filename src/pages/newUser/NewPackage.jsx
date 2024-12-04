import "./new.scss";
import Sidebar from "../../components/sidebar/SidebarA";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import axios from "axios";

const NewPackage = ({ title }) => {
    const [formData, setFormData] = useState({
        packageName: "",
        description: "",
        price: "",
        duration: "",
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

        try {
            const response = await axios.post("http://localhost:8080/packageServices", formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Package saved successfully:", response.data);
            setSuccessMessage("Package saved successfully!");
            setError(null);
        } catch (error) {
            console.error("There was an error saving the package!", error);
            setSuccessMessage("");
            setError("Failed to create package");
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
                                <label>Package Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter package name"
                                    name="packageName"
                                    value={formData.packageName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="formInput">
                                <label>Description</label>
                                <textarea
                                    placeholder="Enter description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="formInput">
                                <label>Price</label>
                                <input
                                    type="number"
                                    placeholder="Enter price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="formInput">
                                <label>Duration (days)</label>
                                <input
                                    type="number"
                                    placeholder="Enter duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                />
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

export default NewPackage;
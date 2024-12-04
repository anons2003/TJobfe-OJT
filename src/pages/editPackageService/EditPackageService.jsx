import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './editPackageService.scss';

const EditPackageService = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [packageData, setPackageData] = useState({
        packageName: '',
        description: '',
        price: '',
        duration: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await axios.get(`https://topjob-ojt-790cf940c139.herokuapp.com/packageServices/${id}`);
                setPackageData(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPackage();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPackageData(prevData => ({
            ...prevData, [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://topjob-ojt-790cf940c139.herokuapp.com/packageServices/${id}`, packageData);
            setSuccessMessage('Package updated successfully!');
            setTimeout(() => {
                navigate('/packageServices');
            }, 2000); // Wait for 2 seconds before navigating back
        } catch (error) {
            console.error('Error updating package:', error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="editPackageService">
            <h1>Edit Package Service</h1>
            {successMessage && <p className="successMessage">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Package Name:
                    <input type="text" name="packageName" value={packageData.packageName} onChange={handleChange} required />
                </label>
                <label>
                    Description:
                    <textarea name="description" value={packageData.description} onChange={handleChange} required />
                </label>
                <label>
                    Price:
                    <input type="number" name="price" value={packageData.price} onChange={handleChange} required />
                </label>
                <label>
                    Duration (days):
                    <input type="number" name="duration" value={packageData.duration} onChange={handleChange} required />
                </label>
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditPackageService;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './editPackageService.scss';

const EditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blogData, setBlogData] = useState({
        title: '',
        content: '',
        author: '',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/blogs/${id}`);
                setBlogData(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlogData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/blogs/edit/${id}`, blogData);
            setSuccessMessage('Blog updated successfully!');
            setTimeout(() => {
                navigate('/blogs');
            }, 2000);
        } catch (error) {
            console.error('Error updating blog:', error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="editPackageService">
            <h1>Edit Blog</h1>
            {successMessage && <p className="successMessage">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input type="text" name="title" value={blogData.title} onChange={handleChange} required />
                </label>
                <label>
                    Content:
                    <textarea name="content" value={blogData.content} onChange={handleChange} required />
                </label>
                <label>
                    Author:
                    <input type="text" name="author" value={blogData.author} onChange={handleChange} required />
                </label>
                <label>
                    Image URL:
                    <input type="text" name="imageUrl" value={blogData.imageUrl} onChange={handleChange} />
                </label>
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditBlog;
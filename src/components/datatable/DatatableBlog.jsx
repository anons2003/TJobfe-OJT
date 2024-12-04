import { DataGrid } from '@mui/x-data-grid';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./datatable.scss";
import axios from 'axios';

const DatatableBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch('http://localhost:8080/blogs/getAllBlogs');
                if (!response.ok) {
                    throw new Error('Failed to fetch blogs');
                }
                const data = await response.json();
                setBlogs(data);
                setFilteredBlogs(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = blogs.filter(blog =>
            blog.title.toLowerCase().includes(value)
        );
        setFilteredBlogs(filtered);
    };

    const handleToggleActive = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:8080/blogs/toggle-active/${id}`);
            if (response.status === 200) {
                const updatedBlogs = blogs.map(blog => {
                    if (blog.id === id) {
                        return { ...blog, isActive: !blog.isActive };
                    }
                    return blog;
                });
                setBlogs(updatedBlogs);
                setFilteredBlogs(updatedBlogs);
            } else {
                throw new Error('Failed to toggle active status');
            }
        } catch (error) {
            console.error('Error toggling active status:', error);
        }
    };

    return (
        <div className="datatable">
            <div className="datatableTitle">
                Add New Blog
                <Link to="/blogs/add" className="link">
                    Add New
                </Link>
            </div>
            <div className="searchContainer">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="searchInput"
                />
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <DataGrid
                    className="datagrid"
                    rows={filteredBlogs}
                    columns={[
                        { field: 'id', headerName: 'ID', width: 100 },
                        { field: 'title', headerName: 'Title', width: 200 },
                        { field: 'content', headerName: 'Content', width: 200 },
                        { field: 'author', headerName: 'Author', width: 200 },
                        { field: 'createdAt', headerName: 'Created At', width: 150, type: 'date' },
                        {
                            field: 'isActive', headerName: 'Active', width: 100, renderCell: (params) => (
                                <span>{params.value ? 'Active' : 'Inactive'}</span>
                            )
                        },
                        {
                            field: 'action',
                            headerName: 'Action',
                            width: 250,
                            renderCell: (params) => (
                                <div className="cellAction">
                                    <Link to={`/blogs/edit/${params.row.id}`} className="viewButton">Edit</Link>
                                    <button
                                        className="lockButton"
                                        onClick={() => handleToggleActive(params.row.id)}
                                    >
                                        {params.row.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
            )}
        </div>
    );
};

export default DatatableBlog;
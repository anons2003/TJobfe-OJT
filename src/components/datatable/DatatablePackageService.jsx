import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './datatable.scss';

const DatatablePackageService = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch('http://localhost:8080/packageServices/list');
                if (!response.ok) {
                    throw new Error('Failed to fetch packages');
                }
                const data = await response.json();
                const transformedData = transformData(data);
                setPackages(transformedData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    const transformData = (data) => {
        return data.map(item => ({
            id: item.packageId,
            packageName: item.packageName,
            description: item.description,
            price: item.price,
            duration: item.duration,
        }));
    };

    const handleDeletePackage = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/packageServices/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete package');
            }

            // Remove package from the local state
            setPackages(prevPackages => prevPackages.filter(pkg => pkg.id !== id));
        } catch (error) {
            console.error('Error deleting package:', error.message);
            // Optionally, you can handle error states here, such as displaying an error message.
        }
    };

    return (
        <div className="datatable">
            <div className="datatableTitle">
                Add New Package
                <Link to="/packageServices/add" className="link">
                    Add New
                </Link>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <DataGrid
                    className="datagrid"
                    rows={packages}
                    columns={[
                        { field: 'id', headerName: 'ID', width: 70 },
                        { field: 'packageName', headerName: 'Package Name', width: 200 },
                        { field: 'description', headerName: 'Description', width: 400 },
                        { field: 'price', headerName: 'Price', width: 130 },
                        { field: 'duration', headerName: 'Duration (days)', width: 130 },
                        {
                            field: 'action',
                            headerName: 'Action',
                            width: 200,
                            renderCell: (params) => (
                                <div className="cellAction">
                                    <Link to={`/packageServices/edit/${params.row.id}`} className="viewButton">
                                        Edit
                                    </Link>
                                    {/* <button className="deleteButton" onClick={() => handleDeletePackage(params.row.id)}>
                                        Delete
                                    </button> */}
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

export default DatatablePackageService;
import { DataGrid } from '@mui/x-data-grid';
import { enterpriseColumns } from '../../data/datatablesourceenterprise';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./datatable.scss";

const DatatableEnterprise = () => {
    const [enterprises, setEnterprises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnterprises = async () => {
            try {
                const response = await fetch('http://localhost:8080/enterprises/list');
                if (!response.ok) {
                    throw new Error('Failed to fetch enterprises');
                }
                const data = await response.json();
                const transformedData = transformData(data);
                setEnterprises(transformedData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEnterprises();
    }, []);

    const transformData = (data) => {
        return data.map(item => ({
            id: item.eid,
            enterprise_name: item.enterprise_name,
            user_name: item.user.user_name,
            email: item.user.email,
            created_at: new Date(item.created_at).toLocaleDateString(),  // Format date
            role: item.user.roleType ? item.user.roleType.roleTypeName : 'Unknown Role',
            is_active: item.user.isActive === 1 ? "Active" : "Inactive", // Check if isActive is 1 or 0
            // avatarUrl: `https://avatars.dicebear.com/api/initials/${item.avatar_url}.svg`
        }));
    };

    const handleToggleActive = async (id, currentIsActive) => {
        try {
            const response = await fetch(`http://localhost:8080/enterprises/toggle-active/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to toggle active status');
            }

            // Update enterprise's isActive status in the local state
            setEnterprises(prevEnterprises =>
                prevEnterprises.map(enterprise =>
                    enterprise.id === id ? { ...enterprise, is_active: !currentIsActive ? "Active" : "Inactive" } : enterprise
                )
            );
        } catch (error) {
            console.error('Error toggling active status:', error.message);
            // Optionally, you can handle error states here, such as displaying an error message.
        }
    };

    return (
        <div className="datatable">
            <div className="datatableTitle">
                Add New Enterprise
                <Link to="/users/enterprises/add" className="link">
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
                    rows={enterprises}
                    columns={[
                        ...enterpriseColumns,
                        {
                            field: 'action',
                            headerName: 'Action',
                            width: 200,
                            renderCell: (params) => (
                                <div className="cellAction">
                                    <Link to={`/users/enterprises/view/${params.row.id}`} className="viewButton">
                                        View
                                    </Link>
                                    <button
                                        className="lockButton"
                                        style={{ color: 'black' }} // Inline style for black text color
                                        onClick={() => handleToggleActive(params.row.id, params.row.is_active === "Active")}
                                    >
                                        {params.row.is_active === "Active" ? "Lock" : "Unlock"}
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

export default DatatableEnterprise;
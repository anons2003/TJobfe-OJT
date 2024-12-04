import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const DatatableAdmin = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await fetch('https://topjob-ojt-790cf940c139.herokuapp.com/admins/list');
                if (!response.ok) {
                    throw new Error('Failed to fetch admins');
                }
                const data = await response.json();
                const adminsWithId = data.map((admin) => ({
                    ...admin,
                    id: admin.uid, // Assuming 'uid' is a unique identifier for admins
                    createTime: new Date(...admin.createTime).toLocaleString(), // Format createTime
                    isActive: admin.isActive ? 'Active' : 'Inactive', // Convert isActive boolean to string
                    roleType: admin.roleType.roleTypeName, // Extract roleTypeName from roleType object
                }));
                setAdmins(adminsWithId);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []);

    const columns = [
        { field: 'uid', headerName: 'ID', width: 100 },
        { field: 'username', headerName: 'Username', width: 250 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'createTime', headerName: 'Create Time', width: 200 },
        { field: 'isActive', headerName: 'Active', width: 200 },
        { field: 'roleType', headerName: 'Role Type', width: 150 },
    ];

    return (
        <div style={{ height: 500, width: '100%' }}>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <DataGrid rows={admins} columns={columns} pageSize={10} />
            )}
        </div>
    );
};

export default DatatableAdmin;
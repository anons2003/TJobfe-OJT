import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import "./datatable.scss";

const DatatablePayment = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch('https://topjob-ojt-790cf940c139.herokuapp.com/payment/list');
                if (!response.ok) {
                    throw new Error('Failed to fetch payments');
                }
                const data = await response.json();
                setPayments(transformData(data));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const transformData = (data) => {
        return data.map(item => ({
            id: item.hid, // Unique identifier for DataGrid
            amount: `$${item.amount.toFixed(2)}`, // Format amount
            createdAt: new Date(parseInt(item.created_at)).toLocaleString(), // Format timestamp
            status: item.status,
            type: item.type,
            userName: item.user?.user_name || 'N/A', // Optional chaining for user details
            email: item.user?.email || 'N/A',
        }));
    };

    return (
        <div className="datatable">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <DataGrid
                    className="datagrid"
                    rows={payments}
                    columns={[
                        { field: 'id', headerName: 'ID', width: 100 },
                        { field: 'userName', headerName: 'User Name', width: 150 },
                        { field: 'email', headerName: 'Email', width: 200 },
                        { field: 'amount', headerName: 'Amount', width: 150 },
                        { field: 'status', headerName: 'Status', width: 120 },
                        { field: 'type', headerName: 'Type', width: 120 },
                        { field: 'createdAt', headerName: 'Created At', width: 200 },
                    ]}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
            )}
        </div>
    );
};

export default DatatablePayment;

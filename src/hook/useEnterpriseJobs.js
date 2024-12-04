import { useState, useEffect } from 'react';
import api from '../api/http';

const useEnterpriseJobs = (eid) => {
    const [jobData, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!eid) return;

        const fetchJobs = async () => {
            try {
                const response = await api.get(`/enterprises/jobs/${eid}`);
                setJobs(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [eid]);

    return { jobData, loading, error };
};

export default useEnterpriseJobs;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import AboutTwo from "../components/aboutTwo";
import FormSelect from "../components/formSelect";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";
import { FiClock, FiMapPin, FiDollarSign } from "../assets/icons/vander";
import useJobInfo from "../hook/useJobInfo";
import bg1 from '../assets/images/hero/bg.jpg';

const formatDateTime = (dateArray) => {
    if (!dateArray) return null;
    const [year, month, day, hour, minute, second, nanosecond] = dateArray;
    const millisecond = Math.floor(nanosecond / 1000000);
    return new Date(year, month - 1, day, hour, minute, second, millisecond);
};

const compareWithCurrentDate = (date) => {
    if (!date) return null;
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export default function JobGridTwo() {
    const { data, isLoading, isError, error } = useJobInfo();
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 12;

    useEffect(() => {
        if (data?.data) {
            setFilteredJobs(data.data);
        }
    }, [data]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    const handleSearch = ({ keyword, location, Category }) => {
        if (!data?.data) return;

        console.log("Search Params:", { keyword, location, Category });

        const filtered = data.data.filter((job) => {
            const matchesKeyword = keyword
                ? job.title.toLowerCase().includes(keyword.toLowerCase()) ||
                job.enterprise.enterprise_name.toLowerCase().includes(keyword.toLowerCase())
                : true;
            const matchesLocation = location ? job.state === location : true;
            const matchesCategory = Category
                ? job.jobCategoryEntity.jobCategoryId === parseInt(Category, 10)
                : true;

            return matchesKeyword && matchesLocation && matchesCategory;
        });

        console.log("Filtered Jobs:", filtered);
        setFilteredJobs(filtered);
        setNoResults(filtered.length === 0);
        setCurrentPage(1);
    };

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <Navbar navClass="defaultscroll sticky" navLight={true} />
            <section className="bg-half-170 d-table w-100" style={{ backgroundImage: `url(${bg1})`, backgroundPosition: 'top' }}>
                <div className="bg-overlay bg-gradient-overlay"></div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">Job Vacancies</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="position-relative">
                <div className="shape overflow-hidden text-white">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>
            <section className="section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 mt-4">
                            <div className="features-absolute">
                                <div className="d-md-flex justify-content-between align-items-center bg-white shadow rounded p-4">
                                    <FormSelect onSearch={handleSearch} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mt-60">
                    {noResults ? (
                        <div className="alert alert-info text-center">
                            Sorry, No jobs match your search criteria.
                        </div>
                    ) : (
                        <div className="row g-4">
                            {currentJobs.map((item, index) => {
                                const createdAtDate = formatDateTime(item.createdDate);
                                const daysAgo = compareWithCurrentDate(createdAtDate);
                                return (
                                    <div className="col-lg-4 col-md-6 col-12" key={index}>
                                        <div className="job-post rounded shadow bg-white">
                                            <div className="p-4">
                                                <Link to={`/job-detail-three/${item.id}`} className="text-dark title h5">{item.title}</Link>
                                                <p className="text-muted d-flex align-items-center small mt-3">
                                                    <FiClock className="fea icon-sm text-primary me-1" />Posted {daysAgo} Days ago
                                                </p>
                                                <ul className="list-unstyled d-flex justify-content-between align-items-center mb-0 mt-3">
                                                    <li className="list-inline-item"><span className="badge bg-soft-primary">{item.jobTime}</span></li>
                                                    <li className="list-inline-item"><span className="text-muted d-flex align-items-center small"><FiDollarSign className="fea icon-sm text-primary me-1" />{item.minSalary} - {item.maxSalary}/mo</span></li>
                                                </ul>
                                            </div>
                                            <div className="d-flex align-items-center p-4 border-top">
                                                <img src={item.enterprise.avatar_url} className="avatar avatar-small rounded shadow p-3 bg-white" alt="" />
                                                <div className="ms-3">
                                                    <Link to="/employer-profile" className="h5 company text-dark">{item.name}</Link>
                                                    <span className="text-muted d-flex align-items-center mt-1"><FiMapPin className="fea icon-sm me-1" />{item.state}, {item.country}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <div className="row">
                        <div className="col-12 mt-4 pt-2">
                            <ul className="pagination justify-content-center mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <Link className="page-link" to="#" aria-label="Previous" onClick={() => handlePageChange(currentPage - 1)}>
                                        <span aria-hidden="true"><i className="mdi mdi-chevron-left fs-6"></i></span>
                                    </Link>
                                </li>
                                {[...Array(totalPages).keys()].map(number => (
                                    <li className={`page-item ${currentPage === number + 1 ? 'active' : ''}`} key={number}>
                                        <Link className="page-link" to="#" onClick={() => handlePageChange(number + 1)}>{number + 1}</Link>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <Link className="page-link" to="#" aria-label="Next" onClick={() => handlePageChange(currentPage + 1)}>
                                        <span aria-hidden="true"><i className="mdi mdi-chevron-right fs-6"></i></span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <AboutTwo />
            </section>
            <Footer top={true} />
            <ScrollTop />
        </>
    );
}

import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import NavbarDark from "../components/navbarDark";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";
import {
    FiLayout,
    FiMapPin,
    FiUserCheck,
    FiClock,
    FiMonitor,
    FiBriefcase,
    FiBook,
    FiDollarSign,
    FiArrowRight,
} from "../assets/icons/vander";
import useJobInfo from "../hook/useJobInfo";
import { toast } from "react-toastify";
export default function JobDetailThree() {
    let { id } = useParams();
    
    const { data: jobData, isLoading, error } = useJobInfo();
    const [isJobSeeker, setIsJobSeeker] = useState(sessionStorage.getItem("roleJobSeeker"));

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading job details</div>;

    // Ensure jobData and jobData.data are valid before using them
    if (!jobData || !Array.isArray(jobData.data))
        return <div>No job data available</div>;

    // Find the job by id
    let data = jobData.data.find((job) => job.id === parseInt(id));

    if (!data) return <div>Job not found</div>;

    const handleApplyNow = () => {
        if (!isJobSeeker) {
            // If user is not a job seeker, handle accordingly (e.g., show alert or redirect)
            toast.error("You need to log in as a job seeker to apply for jobs.");
            // Example redirect to homepage
            // window.location.href = '/'; // Uncomment this line to redirect to homepage
            return;
        }
        // Proceed with apply logic
        // Redirect to apply page with job data
        window.location.href = `/job-apply/${id}`; // Uncomment this line to redirect to apply page
    };
    console.log(data?.enterprise?.eid)
    return (
        <>
            <NavbarDark />
            <section className="bg-half d-table w-100">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-4 col-md-6">
                            <div className="card border-0 shadow rounded p-4 sticky-bar">
                                {/* <img
                                        src={data?.enterprise?.avatar_url}
                                        className="avatar avatar-medium p-4 rounded-pill shadow bg-white"
                                        alt=""
                                    /> */}
                                <Link to={`/employer-profile/${data?.enterprise.eid}`}>
                                    <img
                                        src={data?.enterprise?.avatar_url}  
                                        className="avatar avatar-medium p-4 rounded-pill shadow bg-white"
                                        alt=""
                                    />
                                </Link>

                                <div className="mt-4">
                                    <h4 className="title mb-3">{data?.title}</h4>
                                    <p className="para-desc text-muted">
                                        Search all the open positions on the web. Get your own
                                        personalized salary estimate. Read reviews on over 30000+
                                        companies worldwide.
                                    </p>
                                    <ul className="list-unstyled mb-0">
                                        <li className="d-inline-flex align-items-center text-muted me-2">
                                            <FiLayout className="fea icon-sm text-primary me-1" />
                                            {data?.enterpriseName} pvt. ltd.
                                        </li>
                                        <li className="d-inline-flex align-items-center text-muted">
                                            <FiMapPin className="fea icon-sm text-primary me-1" />
                                            {data?.state}, {data?.country}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-8 col-md-6">
                            <div className="sidebar border-0">
                                <h5 className="mb-0">Job Information:</h5>

                                <ul className="list-unstyled mb-0 mt-4">
                                    <li className="list-inline-item px-3 py-2 shadow rounded text-start m-1 bg-white">
                                        <div className="d-flex widget align-items-center">
                                            <FiUserCheck className="fea icon-ex-md me-3" />
                                            <div className="flex-1">
                                                <h6 className="widget-title mb-0">Employee Type:</h6>
                                                <small className="text-primary mb-0">
                                                    {data?.jobTime ? data.jobTime : "Full Time"}
                                                </small>
                                            </div>
                                        </div>
                                    </li>

                                    <li className="list-inline-item px-3 py-2 shadow rounded text-start m-1 bg-white">
                                        <div className="d-flex widget align-items-center">
                                            <FiMapPin className="fea icon-ex-md me-3" />
                                            <div className="flex-1">
                                                <h6 className="widget-title mb-0">Location:</h6>
                                                <small className="text-primary mb-0">
                                                    {data?.state}, {data?.country}
                                                </small>
                                            </div>
                                        </div>
                                    </li>

                                    <li className="list-inline-item px-3 py-2 shadow rounded text-start m-1 bg-white">
                                        <div className="d-flex widget align-items-center">
                                            <FiClock className="fea icon-ex-md me-3" />
                                            <div className="flex-1">
                                                <h6 className="widget-title mb-0">Date posted:</h6>
                                                <small className="text-primary mb-0">
                                                    {data?.date ? data.date : "19th June, 2023"}
                                                </small>
                                            </div>
                                        </div>
                                    </li>

                                    <li className="list-inline-item px-3 py-2 shadow rounded text-start m-1 bg-white">
                                        <div className="d-flex widget align-items-center">
                                            <FiMonitor className="fea icon-ex-md me-3" />
                                            <div className="flex-1">
                                                <h6 className="widget-title mb-0">Job Type:</h6>
                                                <small className="text-primary mb-0">
                                                    {data?.title ? data.title : "Back-end Developer"}
                                                </small>
                                            </div>
                                        </div>
                                    </li>

                                    <li className="list-inline-item px-3 py-2 shadow rounded text-start m-1 bg-white">
                                        <div className="d-flex widget align-items-center">
                                            <FiBriefcase className="fea icon-ex-md me-3" />
                                            <div className="flex-1">
                                                <h6 className="widget-title mb-0">Experience:</h6>
                                                <small className="text-primary mb-0">
                                                    {data?.experience}
                                                </small>
                                            </div>
                                        </div>
                                    </li>

                                    <li className="list-inline-item px-3 py-2 shadow rounded text-start m-1 bg-white">
                                        <div className="d-flex widget align-items-center">
                                            <FiBook className="fea icon-ex-md me-3" />
                                            <div className="flex-1">
                                                <h6 className="widget-title mb-0">Qualifications:</h6>
                                                <small className="text-primary mb-0">
                                                    {data?.qualifications}
                                                </small>
                                            </div>
                                        </div>
                                    </li>

                                    <li className="list-inline-item px-3 py-2 shadow rounded text-start m-1 bg-white">
                                        <div className="d-flex widget align-items-center">
                                            <FiDollarSign className="fea icon-ex-md me-3" />
                                            <div className="flex-1">
                                                <h6 className="widget-title mb-0">Salary:</h6>
                                                <small className="text-primary mb-0">
                                                    {data?.minSalary} to {data?.maxSalary}
                                                </small>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-4">
                                <h5>Job Description: </h5>
                                <p className="text-muted">
                                    {data?.description}
                                </p>

                                <h5 className="mt-4">Responsibilities and Duties: </h5>
                                <p className="text-muted">
                                    It sometimes makes sense to select texts containing the
                                    various letters and symbols specific to the output language.
                                </p>
                                <ul className="list-unstyled">
                                    <li className="text-muted mt-2">
                                        <FiArrowRight className="fea icon-sm text-primary me-2" />
                                        Participate in requirements analysis
                                    </li>
                                    <li className="text-muted mt-2">
                                        <FiArrowRight className="fea icon-sm text-primary me-2" />
                                        Write clean, scalable code using C# and .NET frameworks
                                    </li>
                                    <li className="text-muted mt-2">
                                        <FiArrowRight className="fea icon-sm text-primary me-2" />
                                        Test and deploy applications and systems
                                    </li>
                                    <li className="text-muted mt-2">
                                        <FiArrowRight className="fea icon-sm text-primary me-2" />
                                        Revise, update, refactor and debug code
                                    </li>
                                    <li className="text-muted mt-2">
                                        <FiArrowRight className="fea icon-sm text-primary me-2" />
                                        Improve existing software
                                    </li>
                                    <li className="text-muted mt-2">
                                        <FiArrowRight className="fea icon-sm text-primary me-2" />
                                        Develop documentation throughout the software development
                                        life cycle (SDLC)
                                    </li>
                                </ul>

                                <div className="mt-4 pt-2">
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={handleApplyNow}
                                    >
                                        Apply Now <i className="mdi mdi-send"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <ScrollTop />
        </>
    );
}

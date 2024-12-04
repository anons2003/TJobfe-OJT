import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { State } from "country-state-city";
import Navbar from "../components/navbar";
import AboutTwo from "../components/aboutTwo";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";
import { FiClock, FiMapPin, FiDollarSign } from "../assets/icons/vander";
import useEnterpriseInfo from "../hook/useEnterpriseInfo";
import useEnterpriseJobs from "../hook/useEnterpriseJobs";
import api from "../api/http";
import bg1 from "../assets/images/hero/bg.jpg";
import EditJobModal from "../components/EditJobModal";

const formatDateTime = (dateArray) => {
  if (!dateArray) return null;
  const [year, month, day, hour, minute, second, nanosecond] = dateArray;
  return new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    Math.floor(nanosecond / 1000000)
  );
};

const compareWithCurrentDate = (date) => {
  if (!date) return null;
  return Math.ceil(Math.abs(new Date() - date) / (1000 * 60 * 60 * 24));
};

const JobListTwo = () => {

  const { data: enterpriseData } = useEnterpriseInfo();
  const enterpriseResponse = enterpriseData?.data;

  const [jobTypes, setJobTypes] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const { jobData } = useEnterpriseJobs(enterpriseResponse?.eid);
  const [states, setStates] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [isActive, setIsActive] = useState(true); // "" for all, "active" for active jobs, "inactive" for non-active jobs

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    const fetchJobTypesAndCategories = async () => {
      try {
        const [jobTypesResponse, jobCategoriesResponse] = await Promise.all([
          api.get("/job-types"),
          api.get("/job-categories"),
        ]);
        setJobTypes(jobTypesResponse.data);
        setJobCategories(jobCategoriesResponse.data);
      } catch (error) {
        console.error("Error fetching job types and categories:", error);
      }
    };
    fetchJobTypesAndCategories();
  }, [enterpriseResponse]);

  useEffect(() => {
    setStates(State.getStatesOfCountry("VN"));
  }, []);

  useEffect(() => {
    const filterJobs = () => {
      const filtered = jobData.filter((job) => {
        const matchesKeyword = job.title
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
        const matchesCategory = selectedCategory
          ? job.jobCategoryEntity.jobCategoryId === selectedCategory
          : true;
        const matchesLocation = selectedLocation
          ? job.state === selectedLocation
          : true;
        const matchesJobTypes =
          selectedJobTypes.length > 0
            ? selectedJobTypes.includes(job.jobTypeEntity.jobTypeId)
            : true;
        const matchesActive = job.active === isActive;

        return (
          matchesKeyword &&
          matchesCategory &&
          matchesLocation &&
          matchesJobTypes &&
          matchesActive
        );
      });
      setFilteredJobs(filtered);
    };
    filterJobs();
  }, [
    jobData,
    searchKeyword,
    selectedCategory,
    selectedLocation,
    selectedJobTypes,
    isActive,
  ]);

  const handleSearchChange = (e) => setSearchKeyword(e.target.value);
  const handleCategoryChange = (e) =>
    setSelectedCategory(Number(e.target.value));
  const handleLocationChange = (e) => setSelectedLocation(e.target.value);
  const handleJobTypeChange = (event) => {
    const jobTypeId = Number(event.target.value);
    setSelectedJobTypes((prevSelected) =>
      prevSelected.includes(jobTypeId)
        ? prevSelected.filter((id) => id !== jobTypeId)
        : [...prevSelected, jobTypeId]
    );
  };
  const handleActiveChange = (event) => {
    setIsActive(event.target.checked);
  };

  const deleteJob = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );
    if (!confirmed) return;
    try {
      await api.delete(`/jobs/delete/${jobId}`);
      setFilteredJobs(filteredJobs.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error("Error deleting the job:", error);
      alert("There was an error deleting the job. Please try again.");
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
  };

  const handleUpdateJob = async (updatedJob) => {
    try {
      const response = await api.put(
        `/jobs/update/${updatedJob.id}`,
        updatedJob
      );
      setFilteredJobs(
        filteredJobs.map((job) =>
          job.id === updatedJob.id ? response.data : job
        )
      );
      setEditingJob(null);
    } catch (error) {
      console.error("Error updating the job:", error);
      alert("There was an error updating the job. Please try again.");
    }
  };

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredJobs.length / jobsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  console.log("category", jobCategories);
  return (
    <>
      <Navbar navClass="defaultscroll sticky" navLight={true} />
      <section
        className="bg-half-170 d-table w-100"
        style={{ backgroundImage: `url(${bg1})`, backgroundPosition: "top" }}
      >
        <div className="bg-overlay bg-gradient-overlay"></div>
        <div className="container">
          <div className="row mt-5 justify-content-center">
            <div className="col-12">
              <div className="title-heading text-center">
                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
                  Job Vacancies
                </h5>
              </div>
            </div>
          </div>
          <div className="position-middle-bottom">
            <nav aria-label="breadcrumb" className="d-block">
              <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                <li className="breadcrumb-item">
                  <Link to="/">TopJob</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Jobs
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>
      <div className="position-relative">
        <div className="shape overflow-hidden text-white">
          <svg
            viewBox="0 0 2880 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6 col-12">
              <div className="card bg-white p-4 rounded shadow sticky-bar">
                <h6 className="mb-0">Search Properties</h6>
                <div className="search-bar mt-2">
                  <form role="search" className="searchform">
                    <input
                      type="text"
                      className="form-control rounded border"
                      placeholder="Search..."
                      value={searchKeyword}
                      onChange={handleSearchChange}
                    />
                    <input type="submit" value="Search" />
                  </form>
                </div>
                <div className="mt-4">
                  <h6 className="mb-0">Categories</h6>
                  <select
                    className="form-select form-control border mt-2"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Select Job Category</option>
                    {jobCategories.map((category) => (
                      <option
                        key={category.jobCategoryId}
                        value={category.jobCategoryId}
                      >
                        {category.jobCategoryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4">
                  <h6 className="mb-0">Location</h6>
                  <select
                    className="form-select form-control border mt-2"
                    value={selectedLocation}
                    onChange={handleLocationChange}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4">
                  <h6>JobSeeker Types</h6>
                  {jobTypes.map((jobType) => (
                    <div
                      className="d-flex justify-content-between mt-2"
                      key={jobType.jobTypeId}
                    >
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={jobType.jobTypeId}
                          id={jobType.jobTypeId}
                          onChange={handleJobTypeChange}
                          checked={selectedJobTypes.includes(jobType.jobTypeId)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={jobType.jobTypeId}
                        >
                          {jobType.jobTypeName}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <h6>Job Status</h6>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={isActive}
                      id="isActive"
                      onChange={handleActiveChange}
                      checked={isActive}
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      Show Accept Jobs Only
                    </label>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="btn btn-primary w-100">
                    Apply Filter
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-8 col-md-6 col-12">
              <div className="row g-4">
                {currentJobs.map((item, index) => {
                  const createdAtDate = formatDateTime(item.createdDate);
                  const daysAgo = compareWithCurrentDate(createdAtDate);

                  return (
                    <div className="col-12" key={index}>
                      <div className="job-post job-post-list rounded shadow p-4 d-md-flex align-items-center justify-content-between position-relative">
                        <div className="d-flex align-items-center w-250px">
                          <img
                            src={item.enterprise?.avatar_url}
                            className="avatar avatar-small rounded shadow p-3 bg-white"
                            alt=""
                          />
                          <div className="ms-3">
                            <Link
                              to={`/job-detail-three/${item.id}`}
                              className="h5 title text-dark"
                            >
                              {item.title}
                            </Link>
                          </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-between d-md-block mt-3 mt-md-0 w-100px">
                          <span className="badge bg-soft-primary rounded-pill">
                            {item.jobTime}
                          </span>
                          <span className="text-muted d-flex align-items-center fw-medium mt-md-2">
                            <FiClock className="fea icon-sm me-1 align-middle" />
                            {daysAgo} days ago
                          </span>
                        </div>

                        <div className="d-flex align-items-center justify-content-between d-md-block mt-2 mt-md-0 w-130px">
                          <span className="text-muted d-flex align-items-center">
                            <FiMapPin className="fea icon-sm me-1 align-middle" />
                            {item.state}
                          </span>
                          <span className="d-flex fw-medium mt-md-2">
                            <FiDollarSign className="fea icon-sm text-primary me-1" />
                            {item.minSalary} - {item.maxSalary}/mo
                          </span>
                        </div>

                        <div className="mt-3 mt-md-0">
                          {item.active ? (
                            <>
                              <Link
                                to="/candidate-applied-list"
                                className="btn btn-sm btn-primary w-full ms-md-1"
                              >
                                See CV
                              </Link>
                              <button
                                onClick={() => handleEditJob(item)}
                                className="btn btn-sm btn-warning ms-md-1"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteJob(item.id)}
                                className="btn btn-sm btn-danger ms-md-1"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditJob(item)}
                                className="btn btn-sm btn-warning ms-md-1"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteJob(item.id)}
                                className="btn btn-sm btn-danger ms-md-1"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="row">
                <div className="col-12 mt-4 pt-2">
                  <ul className="pagination justify-content-center mb-0">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={handlePreviousPage}
                        aria-label="Previous"
                      >
                        <span aria-hidden="true">
                          <i className="mdi mdi-chevron-left fs-6"></i>
                        </span>
                      </button>
                    </li>
                    {[
                      ...Array(
                        Math.ceil(filteredJobs.length / jobsPerPage)
                      ).keys(),
                    ].map((number) => (
                      <li
                        key={number + 1}
                        className={`page-item ${
                          currentPage === number + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(number + 1)}
                        >
                          {number + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage ===
                        Math.ceil(filteredJobs.length / jobsPerPage)
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={handleNextPage}
                        aria-label="Next"
                      >
                        <span aria-hidden="true">
                          <i className="mdi mdi-chevron-right fs-6"></i>
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AboutTwo />
      </section>
      <Footer top={true} />
      <ScrollTop />

      {editingJob && (
        <EditJobModal
          job={editingJob}
          jobCategories={jobCategories}
          jobTypes={jobTypes}
          states={states}
          onUpdateJob={handleUpdateJob}
          onClose={() => setEditingJob(null)}
        />
      )}
    </>
  );
};

export default JobListTwo;

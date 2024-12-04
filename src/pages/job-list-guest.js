import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { State } from "country-state-city";

import bg1 from "../assets/images/hero/bg.jpg";

import Navbar from "../components/navbar";
import AboutTwo from "../components/aboutTwo";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";

import { FiClock, FiMapPin, FiDollarSign } from "../assets/icons/vander";
import useEnterpriseInfo from "../hook/useEnterpriseInfo";
import useEnterpriseJobs from "../hook/useEnterpriseJobs";
import api from "../api/http";

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
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  return diffDays;
};

export default function JobListGuest() {
  // Get enterprise id
  const { eid } = useParams();
  const { data: enterpriseData } = useEnterpriseInfo(eid);
  const enterprise = enterpriseData?.data;
  // Get type and category
  const [jobTypes, setJobTypes] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const { jobData: jobs } = useEnterpriseJobs(enterprise?.eid);
  const [states, setStates] = useState([]);
  // States for search and filters
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  // Paging
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    async function fetchData() {
      try {
        const jobTypesResponse = await api.get("/job-types");
        const jobCategoriesResponse = await api.get("/job-categories");
        setJobTypes(jobTypesResponse.data);
        setJobCategories(jobCategoriesResponse.data);
      } catch (error) {
        console.error(
          "There was an error fetching the job types and categories:",
          error
        );
      }
    }
    fetchData();
  }, [enterprise]);

  // Event search
  const handleSearchChange = (e) => setSearchKeyword(e.target.value);
  const handleCategoryChange = (e) =>
    setSelectedCategory(Number(e.target.value));

  useEffect(() => {
    const vietnamStates = State.getStatesOfCountry("VN");
    setStates(vietnamStates);
  }, []);

  const handleJobTypeChange = (event) => {
    const jobTypeId = Number(event.target.value);
    setSelectedJobTypes((prevSelected) =>
      prevSelected.includes(jobTypeId)
        ? prevSelected.filter((id) => id !== jobTypeId)
        : [...prevSelected, jobTypeId]
    );
  };

  // Apply filters to jobData
  const filteredJobs = jobs.filter((job) => {
    const matchesKeyword = job.title
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());
    const matchesCategory = selectedCategory
      ? job.jobCategoryEntity.jobCategoryId === selectedCategory
      : true;
    const matchesLocation = selectedLocation
      ? job.states === selectedLocation
      : true;
    const matchesJobTypes =
      selectedJobTypes.length > 0
        ? selectedJobTypes.includes(job.jobTypeEntity.jobTypeId)
        : true;

    const matchesMinSalary = minSalary ? job.minSalary >= minSalary : true;
    const matchesMaxSalary = maxSalary ? job.maxSalary <= maxSalary : true;
    return (
      matchesKeyword &&
      matchesCategory &&
      matchesLocation &&
      matchesJobTypes &&
      matchesMinSalary &&
      matchesMaxSalary
    );
  });

  // Paging logic
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
                <div>
                  <h6 className="mb-0">Search Properties</h6>

                  <div className="search-bar mt-2">
                    <div id="itemSearch2" className="menu-search mb-0">
                      <form
                        role="search"
                        method="get"
                        id="searchItemform2"
                        className="searchform"
                      >
                        <input
                          type="text"
                          className="form-control rounded border"
                          name="s"
                          id="searchItem2"
                          placeholder="Search..."
                          value={searchKeyword}
                          onChange={handleSearchChange}
                        />
                        <input
                          type="submit"
                          id="searchItemsubmit2"
                          value="Search"
                        />
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h6 className="mb-0">Categories</h6>
                  <select
                    className="form-select form-control border mt-2"
                    aria-label="Default select example"
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
                    aria-label="Default select example"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4">
                  <h6>Job Types</h6>
                  {jobTypes.map((jobType) => (
                    <div
                      className="form-check form-check"
                      key={jobType.jobTypeId}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`inlineCheckbox${jobType.jobTypeId}`}
                        value={jobType.jobTypeId}
                        checked={selectedJobTypes.includes(jobType.jobTypeId)}
                        onChange={handleJobTypeChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`inlineCheckbox${jobType.jobTypeId}`}
                      >
                        {jobType.jobTypeName}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h6 className="mb-0">Salary Range</h6>
                  <div className="d-flex">
                    <input
                      type="number"
                      className="form-control me-2"
                      placeholder="Min Salary"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                    />
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max Salary"
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* map */}
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
                          <Link
                            to={`/job-detail-three/${item.id}`}
                            className="btn btn-sm btn-primary w-full ms-md-1"
                          >
                            Apply now
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
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
                        onClick={() => handlePageChange(currentPage - 1)}
                        aria-label="Previous"
                      >
                        <span aria-hidden="true">
                          <i className="mdi mdi-chevron-left fs-6"></i>
                        </span>
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <li
                        className={`page-item ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                        key={index}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
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
              {/* End Pagination */}
            </div>
          </div>
        </div>
      </section>

      <AboutTwo />
      <Footer />
      <ScrollTop />
    </>
  );
}

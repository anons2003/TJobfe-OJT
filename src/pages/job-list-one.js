import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bg1 from "../assets/images/hero/bg.jpg";
import Navbar from "../components/navbar";
import AboutTwo from "../components/aboutTwo";
import FormSelect from "../components/formSelect";
import Footer from "../components/footer";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ScrollTop from "../components/scrollTop";
import { FiClock, FiMapPin, FiBookmark } from "../assets/icons/vander";
import useJobInfo from "../hook/useJobInfo";
import api from "../api/http";
import useJobSeekerInfo from "../hook/useJobSeekerInfo";

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

export default function JobListOne() {
  const { data: jobData, isLoading, error } = useJobInfo();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const { data: userData } = useJobSeekerInfo();
  const jobSeeker = userData?.data;
  //
  const [bookmarkChanges, setBookmarkChanges] = useState([]);
  const [changedJobId, setChangedJobId] = useState(null);
  //
  const [noResults, setNoResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const bookmarkMutation = useMutation({
    mutationFn: (jobId) => {
      const token = sessionStorage.getItem("token");
      return api.post(
        `/jobSeeker/job/${jobId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
    },
  });

  const unbookmarkMutation = useMutation({
    mutationFn: (jobId) => {
      const token = sessionStorage.getItem("token");
      return api.delete(`/jobSeeker/job/${jobId}`, {
        headers: {
          Authorization: token,
        },
      });
    },
  });

  useEffect(() => {
    if (jobData && Array.isArray(jobData.data)) {
      setFilteredJobs(jobData.data);
    }
  }, [jobData]);

  useEffect(() => {
    if (bookmarkMutation.isSuccess || unbookmarkMutation.isSuccess) {
      setBookmarkChanges((prevChanges) => [...prevChanges, changedJobId]);
    }
  }, [bookmarkMutation.isSuccess, unbookmarkMutation.isSuccess]);

  useEffect(() => {
    if (changedJobId !== null) {
      setFilteredJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === changedJobId
            ? {
              ...job,
              bookmarks: job.bookmarks.map((bookmark) =>
                bookmark.jobSeekers.jid === jobSeeker.jid
                  ? { ...bookmark, isBookmarked: !bookmark.isBookmarked }
                  : bookmark
              ),
            }
            : job
        )
      );  
    }
  }, [bookmarkChanges]);


  const handleSearch = ({ keyword, location, Category }) => {
    if (!jobData || !jobData.data) return;

    console.log("Search Params:", { keyword, location, Category });

    const filtered = jobData.data.filter((job) => {
      const matchesKeyword = keyword
        ? job.title.toLowerCase().includes(keyword.toLowerCase()) ||
        job.enterprise.enterprise_name.toLowerCase().includes(keyword.toLowerCase())
        : true;
      const matchesLocation = location ? job.state === location : true;
      const matchesCategory = Category
        ? job.jobCategoryEntity.jobCategoryId === parseInt(Category, 10)  // Ensure Category is parsed as integer
        : true;

      return matchesKeyword && matchesLocation && matchesCategory;
    });

    console.log("Filtered Jobs:", filtered);
    setFilteredJobs(filtered);
    setNoResults(filtered.length === 0);
    setCurrentPage(1); // Reset to the first page when new search is performed
  };

  const toggleBookmark = (jobId, isBookmarked) => {
    const userType = sessionStorage.getItem("roleJobSeeker");
    console.log(userType); // Assuming you store user type in sessionStorage
    if (userType !== "Job-seeker") {
      toast.error("You need to log in as a job seeker to bookmark jobs.");
      return;
    }
    if (isBookmarked === 0) {
      bookmarkMutation.mutate(jobId);
    } else {
      unbookmarkMutation.mutate(jobId);
    }
  };

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading jobs</div>;

  return (
    <>
      <Navbar navClass="defaultscroll sticky" />

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
              {filteredJobs.slice(
                (currentPage - 1) * jobsPerPage,
                currentPage * jobsPerPage
              ).map((item, index) => {
                const createdAtDate = formatDateTime(item.createdDate);
                const daysAgo = compareWithCurrentDate(createdAtDate);

                return (
                  <div className="col-12" key={index}>
                    <div className="job-post job-post-list rounded shadow p-4 d-md-flex align-items-center justify-content-between position-relative search-results">
                      <div className="d-flex align-items-center w-310px">
                        <img
                          src={item.enterprise.avatar_url || ""}
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
                          {item.jobTypeName}
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
                          {item.minSalary} - {item.maxSalary}/mo
                        </span>
                      </div>

                      <div className="mt-3 mt-md-0">
                        <button
                          className={`btn btn-sm btn-icon btn-pills ${jobSeeker &&
                            item.bookmarks.some(
                              (bookmark) =>
                                bookmark.jobSeekers.jid === jobSeeker.jid
                            )
                            ? item.bookmarks.length > 0 &&
                              item.bookmarks[0].isBookmarked === 1
                              ? "btn-primary"
                              : "btn-soft-primary"
                            : "btn-soft-primary"
                            } bookmark`}
                          onClick={() =>
                            toggleBookmark(
                              item.id,
                              item.bookmarks.some(
                                (bookmark) =>
                                  bookmark.jobSeekers.jid === jobSeeker.jid
                              )
                                ? item.bookmarks[0].isBookmarked
                                : 0
                            )
                          }
                        >
                          <FiBookmark className="icons" />
                        </button>
                        <Link
                          to={`/job-detail-three/${item.id}`}
                          className="btn btn-sm btn-primary w-full ms-md-1"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Pagination */}
          <div className="row">
            <div className="col-12 mt-4 pt-2">
              <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    aria-label="Previous"
                  >
                    <span aria-hidden="true">
                      <i className="mdi mdi-chevron-left fs-6"></i>
                    </span>
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => (
                  <li
                    key={index}
                    className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
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

        <AboutTwo />
      </section>
      <Footer top={true} />
      <ScrollTop />
    </>
  );
}

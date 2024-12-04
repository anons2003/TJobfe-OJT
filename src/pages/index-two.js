import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useJobInfo from "../hook/useJobInfo";
import useJobSeekerInfo from "../hook/useJobSeekerInfo";
import heroImg from "../assets/images/hero/bg.jpg";
import api from "../api/http";
import Navbar from "../components/navbar";
import FormSelect from "../components/search-global/formSelect-global";
import AboutUs from "../components/aboutUs";
import Companies from "../components/companies";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";
import { useMutation } from "@tanstack/react-query";
import { FiClock, FiMapPin, FiBookmark } from "../assets/icons/vander";
import { toast } from "react-toastify";
import Error from "./error";
import Loading from "../components/loading";

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

export default function IndexTwo() {
  const { data: jobData, isLoading, error } = useJobInfo();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const { data: userData } = useJobSeekerInfo();
  const jobSeeker = userData?.data;

  const [bookmarkChanges, setBookmarkChanges] = useState([]);
  const [changedJobId, setChangedJobId] = useState(null);

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
    if (changedJobId !== null && jobSeeker && jobSeeker.jid) {
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
  }, [bookmarkChanges, jobSeeker, changedJobId]);

  const toggleBookmark = (jobId, isBookmarked) => {
    const userType = sessionStorage.getItem("roleJobSeeker");
    if (userType !== "Job-seeker") {
      toast.error("You need to log in as a job seeker to bookmark jobs.");
      return;
    }
    setChangedJobId(jobId);
    if (isBookmarked === 0) {
      bookmarkMutation.mutate(jobId);
    } else {
      unbookmarkMutation.mutate(jobId);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <>
      <Navbar navClass="defaultscroll sticky" navLight={true} />
      <section
        className="bg-half-260 d-table w-100"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="bg-overlay bg-primary-gradient-overlay"></div>
        <div className="container">
          <div className="row mt-5 justify-content-center">
            <div className="col-lg-10">
              <div className="title-heading text-center">
                <h1 className="heading text-white fw-bold">
                  Find & Hire Experts <br /> for any Job
                </h1>
                <p className="para-desc text-white-50 mx-auto mb-0">
                  Find Jobs, Employment. Some of the companies we've helped
                  recruit excellent applicants over the years.
                </p>

                <div className="d-md-flex justify-content-between align-items-center bg-white shadow rounded p-2 mt-4">
                  <FormSelect />
                </div>

                <div className="mt-2">
                  <span className="text-white-50">
                    <span className="text-white">Popular Searches :</span>{" "}
                    Designer, Developer, Web, IOS, PHP Senior Engineer
                  </span>
                </div>
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
          <div className="row justify-content-center mb-4 pb-2">
            <div className="col-12">
              <div className="section-title text-center">
                <h4 className="title mb-3">Trending Services</h4>
                <p className="text-muted para-desc mx-auto mb-0">
                  Search all the open positions on the web. Get your own
                  personalized salary estimate. Read reviews on over 30000+
                  companies worldwide.
                </p>
              </div>
            </div>
          </div>

          {/* <ServicesTwo/> */}
        </div>
        <AboutUs containerClass="container mt-100 mt-60" />

        <div className="container mt-100 mt-60">
          <div className="row justify-content-center mb-4 pb-2">
            <div className="col-12">
              <div className="section-title text-center">
                <h4 className="title mb-3">Popular Job Listing</h4>
                <p className="text-muted para-desc mx-auto mb-0">
                  Search all the open positions on the web. Get your own
                  personalized salary estimate. Read reviews on over 30000+
                  companies worldwide.
                </p>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-0">
            {filteredJobs.slice(0, 8).map((item, index) => {
              const createdAtDate = formatDateTime(item.createdDate);
              const daysAgo = compareWithCurrentDate(createdAtDate);
              const isBookmarked = jobSeeker
                ? item.bookmarks.some(
                    (bookmark) =>
                      bookmark.jobSeekers.jid === jobSeeker.jid &&
                      bookmark.isBookmarked === 1
                  )
                : false;
              return (
                <div className="col-12" key={index}>
                  <div className="job-post job-post-list rounded shadow p-4 d-md-flex align-items-center justify-content-between position-relative">
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
                        {item.minSalary} - {item.maxSalary}/mo
                      </span>
                    </div>

                    <div className="mt-3 mt-md-0">
                      <button
                        className={`btn btn-sm btn-icon btn-pills ${
                          isBookmarked ? "btn-primary" : "btn-soft-primary"
                        } bookmark`}
                        onClick={() =>
                          toggleBookmark(item.id, isBookmarked ? 1 : 0)
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

            <div className="col-12">
              <div className="text-center">
                <Link
                  to="/job-list-one"
                  className="btn btn-link primary text-muted"
                >
                  See More Jobs <i className="mdi mdi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-100 mt-60">
          <Companies />
        </div>
      </section>
      <Footer />
      <ScrollTop />
    </>
  );
}

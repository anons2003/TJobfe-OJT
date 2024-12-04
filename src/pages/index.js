import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import bg1 from "../assets/images/bg2.png";
import hero1 from "../assets/images/hero1.png";
import company1 from "../assets/images/company/circle-logo.png";
import company2 from "../assets/images/company/facebook-logo.png";
import company3 from "../assets/images/company/google-logo.png";
import company4 from "../assets/images/company/lenovo-logo.png";
import company5 from "../assets/images/company/android.png";
import company6 from "../assets/images/company/linkedin.png";
import company7 from "../assets/images/company/skype.png";
import company8 from "../assets/images/company/snapchat.png";

import Navbar from "../components/navbar";
import AboutUs from "../components/aboutUs";
import Footer from "../components/footer";
import AboutTwo from "../components/aboutTwo";
import ScrollTop from "../components/scrollTop";
import { FiSearch, FiClock, FiMapPin } from "../assets/icons/vander";
import useEnterpriseInfo from "../hook/useEnterpriseInfo";
import useEnterpriseJobs from "../hook/useEnterpriseJobs";
import FormSelect from "../components/search-global/formSelect-global";
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

export default function Index() {
  const { eid } = useParams(); // Lấy eid từ URL
  const enterpriseRole = sessionStorage.getItem("roleEnterprise");
  const { data: enterpriseData } = useEnterpriseInfo(eid);
  const enterprise = enterpriseData?.data;
  const {
    jobData: jobs,
    isLoading,
    error,
  } = useEnterpriseJobs(enterprise?.eid);

  // const { data: jobData} = useJobInfo();
  // console.log("jobs", jobs);
  // console.log("eid", enterprise?.eid);
  // console.log("enterprise id from URL:", eid);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredJobs([]);
    } else {
      const filtered = jobs?.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.enterprise?.enterprise_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm, jobs]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <>
      <Navbar navClass="defaultscroll sticky" />

      <section
        className="bg-half-170 d-table w-100 bg-primary"
        style={{ backgroundImage: `url(${bg1})`, backgroundPosition: "center" }}
      >
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-6">
              <div className="title-heading">
                <h1 className="heading text-white fw-bold">
                  Get hired <br /> by the popular <br /> candidates.
                </h1>
                <p className="para-desc text-white-50 mb-0">
                  Find Jobs, Employment. Checking Applied
                </p>
                {/* search golbal */}
                {/* <div className="d-md-flex justify-content-between align-items-center bg-white shadow rounded p-2 mt-4"> */}
                {/* <FormSelect /> */}

                {/* search inside */}
                <div className="text-center subscribe-form mt-4">
                  <form style={{ maxWidth: "800px" }}>
                    <div className="mb-0">
                      <div className="position-relative">
                        <FiSearch className="fea icon-20 position-absolute top-50 start-0 translate-middle-y ms-3" />
                        <input
                          type="text"
                          id="help"
                          name="name"
                          className="shadow rounded-pill bg-white ps-5"
                          required
                          placeholder="Search Your Jobs"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-pills"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                  {searchTerm && (
                    <div className="search-results mt-3 bg-white rounded shadow p-3">
                      {filteredJobs.length > 0 ? (
                        <ul className="list-group">
                          {filteredJobs.map((job, index) => (
                            <li key={index} className="list-group-item">
                              <Link
                                to={`/job-detail-three/${job.id}`}
                                className="text-dark"
                              >
                                {job.title} - {job.enterprise?.enterprise_name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">No matching jobs found</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="position-relative ms-lg-5">
                <img src={hero1} className="img-fluid p-5" alt="" />

                <div className="spinner">
                  <div className="position-absolute top-0 start-0 mt-lg-5 mt-4 ms-lg-5 ms-4">
                    <img
                      src={company1}
                      className="avatar avatar-md-sm rounded shadow p-2 bg-white"
                      alt=""
                    />
                  </div>
                  <div className="position-absolute top-0 start-50 translate-middle-x">
                    <img
                      src={company2}
                      className="avatar avatar-md-sm rounded shadow p-2 bg-white"
                      alt=""
                    />
                  </div>
                  <div className="position-absolute top-0 end-0 mt-lg-5 mt-4 me-lg-5 me-4">
                    <img
                      src={company3}
                      className="avatar avatar-md-sm rounded shadow p-2 bg-white"
                      alt=""
                    />
                  </div>
                  <div className="position-absolute top-50 start-0 translate-middle-y">
                    <img
                      src={company4}
                      className="avatar avatar-md-sm rounded shadow p-2 bg-white"
                      alt=""
                    />
                  </div>
                  <div className="position-absolute top-50 end-0 translate-middle-y">
                    <img
                      src={company5}
                      className="avatar avatar-md-sm rounded shadow p-2 bg-white"
                      alt=""
                    />
                  </div>
                  <div className="position-absolute bottom-0 start-0 mb-lg-5 mb-4 ms-lg-5 ms-4">
                    <img
                      src={company6}
                      className="avatar avatar-md-sm rounded shadow p-2 bg-white"
                      alt=""
                    />
                  </div>
                  <div className="position-absolute bottom-0 start-50 translate-middle-x">
                    <img
                      src={company7}
                      className="avatar avatar-md-sm rounded shadow p-2 bg-white"
                      alt=""
                    />
                  </div>
                  <div className="position-absolute bottom-0 end-0 mb-lg-5 mb-4 me-lg-5 me-4">
                    <img
                      src={company8}
                      className="avatar avatar-md-sm rounded shadow p-2 bg-white"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <AboutUs containerClass="container" />
        {/* <Categories /> */}
        <div className="container mt-100 mt-60">
          <div className="row align-items-end mb-4 pb-2">
            <div className="col-lg-6 col-md-9">
              <div className="section-title text-md-start text-center">
                <h4 className="title mb-3">Explore Jobs</h4>
                <p className="text-muted para-desc mb-0">
                  Search all the open positions on the web. Get your own
                  personalized salary estimate. Read reviews on over 30000+
                  companies worldwide.
                </p>
              </div>
            </div>

            <div className="col-lg-6 col-md-3 d-none d-md-block">
              <div className="text-md-end">
                <Link
                  to="/job-list-one"
                  className="btn btn-link primary text-muted"
                >
                  See More Jobs <i className="mdi mdi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-0">
            {jobs?.map((item, index) => {
              const createdAtDate = formatDateTime(item.createdDate);
              const daysAgo = compareWithCurrentDate(createdAtDate);
              return (
                <div className="col-lg-4 col-md-6 col-12" key={index}>
                  <div className="job-post rounded shadow p-4">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <img
                          src={item.enterprise.avatar_url}
                          className="avatar avatar-small rounded shadow p-3 bg-white"
                          alt=""
                        />

                        <div className="ms-3">
                          <Link
                            to="/employer-profile"
                            className="h5 company text-dark"
                          >
                            {item.name}
                          </Link>
                          <span className="text-muted d-flex align-items-center small mt-2">
                            <FiClock className="fea icon-sm me-1" /> Poster{" "}
                            {daysAgo} days ago
                          </span>
                        </div>
                      </div>

                      <span className="badge bg-soft-primary">
                        {item.jobTime}
                      </span>
                    </div>

                    <div className="mt-4">
                      <Link
                        to={`/job-detail-three/${item.id}`}
                        className="text-dark title h5"
                      >
                        {item.title}
                      </Link>

                      <span className="text-muted d-flex align-items-center mt-2">
                        <FiMapPin className="fea icon-sm me-1" />
                        {item.state}
                      </span>

                      <div className="progress-box mt-3">
                        <div className="progress mb-2">
                          <div
                            className="progress-bar position-relative bg-primary"
                            style={{ width: "50%" }}
                          ></div>
                        </div>

                        <span className="text-dark">
                          {item.applied} applied of{" "}
                          <span className="text-muted">
                            {item.minSalary}-{item.maxSalary} vacancy
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="col-12 d-md-none d-block">
              <div className="text-center">
                <Link
                  to="/job-list-by-enterprise"
                  className="btn btn-link primary text-muted"
                >
                  See More Jobs <i className="mdi mdi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <AboutTwo />

        {/* <div className="container mt-100 mt-60">
                    <Companies />
                </div> */}
      </section>
      <Footer />
      <ScrollTop />
    </>
  );
}

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bg1 from "../../assets/images/hero/bg.jpg";
import Navbar from "../../components/navbar";
import Faq from "../../components/faq";
import Footer from "../../components/footer";
import ScrollTop from "../../components/scrollTop";
import FormSelect from "../../components/formSelectEnterprise";
import { FiMapPin } from "../../assets/icons/vander";


export default function Employers() {
  const [enterprises, setEnterprises] = useState([]);
  const [filteredEnterprises, setFilteredEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        const response = await fetch("http://localhost:8080/enterprises/list");
        if (!response.ok) {
          throw new Error("Failed to fetch enterprises");
        }
        const data = await response.json();
        const transformedData = data.map((item) => ({
          id: item.eid,
          name: item.enterprise_name,
          image: item.avatar_url,
          state: item.state,
          employees: item.employees,
        }));
        setEnterprises(transformedData);
        setFilteredEnterprises(transformedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnterprises();
  }, []);

  const handleSearch = ({ keyword, location }) => {
    if (!enterprises || !Array.isArray(enterprises)) return;

    console.log("Search Params:", { keyword, location });

    const filtered = enterprises.filter((enterprise) => {
      const matchesKeyword = keyword
        ? enterprise.name.toLowerCase().includes(keyword.toLowerCase())
        : true;
      const matchesLocation = location ? enterprise.state === location : true;

      return matchesKeyword && matchesLocation;
    });

    console.log("Filtered Enterprises:", filtered);
    setFilteredEnterprises(filtered);
    setNoResults(filtered.length === 0);
    setCurrentPage(1); // Reset to the first page when new search is performed
  };

  const totalPages = Math.ceil(filteredEnterprises.length / itemsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading enterprises</div>;

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
                  Enterprise
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
          <div className="row g-4 gy-5">
            {noResults ? (
              <div className="alert alert-info text-center">
                Sorry, No enterprises match your search criteria.
              </div>
            ) : (
              filteredEnterprises
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((item, index) => (
                  <div
                    className="col-lg-3 col-md-4 col-sm-6 col-12"
                    key={index}
                  >
                    <div className="employer-card position-relative bg-white rounded shadow p-4 mt-3">
                      <div className="employer-img d-flex justify-content-center align-items-center bg-white shadow-md rounded">
                        <img
                          src={item.image}
                          className="avatar avatar-ex-small"
                          alt=""
                        />
                      </div>
                      <div className="content mt-3">
                        <Link
                          to={`/employer-profile/${item.id}`}
                          className="title text-dark h5"
                        >
                          {item.name}
                        </Link>
                        <p className="text-muted mt-2 mb-0">
                          Digital Marketing Solutions for Tomorrow
                        </p>
                      </div>
                      <ul className="list-unstyled d-flex justify-content-between align-items-center border-top mt-3 pt-3 mb-0">
                        <li className="text-muted d-inline-flex align-items-center">
                          <FiMapPin className="fea icon-sm me-1 align-middle" />
                          {item.state}
                        </li>
                        <li className="list-inline-item text-primary fw-medium">
                          {item.employees} employees
                        </li>
                      </ul>
                    </div>
                  </div>
                ))
            )}
          </div>
          <div className="row">
            <div className="col-12 mt-4 pt-2">
              <ul className="pagination justify-content-center mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
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
        <div className="container mt-100 mt-60">
          <Faq />
        </div>
      </section>
      <Footer top={true} />
      <ScrollTop />
    </>
  );
}

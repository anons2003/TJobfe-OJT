import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";
import { FiCalendar } from "../assets/icons/vander";
import bg1 from "../assets/images/hero/bg.jpg";
import "./blogs.css";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          "https://topjob-ojt-790cf940c139.herokuapp.com/blogs/getAllActiveBlogsSortedByCreatedAt"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
    <>
      <Navbar />
      <section
        className="bg-half-170 d-table w-100"
        style={{ backgroundImage: `url(${bg1})`, backgroundPosition: "top" }}
      >
        <div className="bg-overlay bg-gradient-overlay"></div>
        <div className="container">
          <div className="row mt-5 justify-content-center">
            <div className="col-12">
              <div className="title-heading text-center">
                <p className="text-white-50 para-desc mx-auto mb-0">
                  Tin Tức Mới Nhất
                </p>
                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
                  Blogs & Tin Tức
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
                  Blogs
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
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              currentBlogs.map((item, index) => (
                <div className="col-lg-4 col-md-6" key={index}>
                  <div className="card blog blog-primary shadow rounded overflow-hidden border-0">
                    <div className="card-img blog-image position-relative overflow-hidden rounded-0">
                      <div className="position-relative overflow-hidden">
                        <img src={item.imageUrl} className="img-fluid" alt="" />
                        <div className="card-overlay"></div>
                      </div>
                    </div>

                    <div className="card-body blog-content position-relative p-0">
                      <div className="p-4">
                        <ul className="list-unstyled text-muted small mb-2">
                          <li className="d-inline-flex align-items-center me-2">
                            <FiCalendar className="fea icon-ex-sm me-1 text-dark" />
                            {item.createdDate}
                          </li>
                        </ul>

                        <Link
                          to={`/blog-detail/${item.id}`}
                          className="title fw-semibold fs-5 text-dark"
                        >
                          {item.title}
                        </Link>

                        <ul className="list-unstyled d-flex justify-content-between align-items-center text-muted mb-0 mt-3">
                          <li className="list-inline-item me-2">
                            <Link
                              to={`/blog-detail/${item.id}`}
                              className="btn btn-link primary text-dark"
                            >
                              Đọc Ngay <i className="mdi mdi-arrow-right"></i>
                            </Link>
                          </li>
                          <li className="list-inline-item">
                            <span className="text-dark">By</span>{" "}
                            <Link to="" className="text-muted link-title">
                              {item.author}
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
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
                  <Link
                    className="page-link"
                    to="#"
                    aria-label="Previous"
                    onClick={() => paginate(currentPage - 1)}
                  >
                    <span aria-hidden="true">
                      <i className="mdi mdi-chevron-left fs-6"></i>
                    </span>
                  </Link>
                </li>
                {Array.from({ length: totalPages }, (_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <Link
                      className="page-link"
                      to="#"
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </Link>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <Link
                    className="page-link"
                    to="#"
                    aria-label="Next"
                    onClick={() => paginate(currentPage + 1)}
                  >
                    <span aria-hidden="true">
                      <i className="mdi mdi-chevron-right fs-6"></i>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <ScrollTop />
    </>
  );
}

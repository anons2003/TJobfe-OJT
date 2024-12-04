import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import bg1 from "../assets/images/hero/bg.jpg";
import Navbar from "../components/navbar";
import BlogsSidebars from "../components/blogsSidebars";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";

export default function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`http://localhost:8080/blogs/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch blog");
                }
                const data = await response.json();
                setBlog(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

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
                                <span className="badge bg-primary">
                                    {blog?.tag || "TopJob"}
                                </span>
                                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark mt-4">
                                    {blog?.title ||
                                        "Sử Dụng Banner Stands Để Tăng Lưu Lượng Truy Cập Tại Triển Lãm Thương Mại"}
                                </h5>

                                <ul className="list-inline text-center mb-0">
                                    <li className="list-inline-item mx-4 mt-4">
                                        <span className="text-white-50 d-block">Tác giả</span>
                                        <Link to="#" className="text-white title-dark">
                                            {blog?.author || "Facebook"}
                                        </Link>
                                    </li>

                                    <li className="list-inline-item mx-4 mt-4">
                                        <span className="text-white-50 d-block">Ngày</span>
                                        <span className="text-white title-dark">
                                            {blog?.createdAt || "19 tháng 6, 2023"}
                                        </span>
                                    </li>

                                    <li className="list-inline-item mx-4 mt-4">
                                        <span className="text-white-50 d-block">Thời gian đọc</span>
                                        <span className="text-white title-dark">
                                            {blog?.readingTime || "8 phút đọc"}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="position-middle-bottom">
                        <nav aria-label="breadcrumb" className="d-block">
                            <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                                <li className="breadcrumb-item">
                                    <Link to="/">TopJob</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to="/blogss">Blogs</Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Chi Tiết
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-8 col-md-7">
                            <div className="card border-0 shadow rounded overflow-hidden">
                                <img
                                    src={blog?.imageUrl || "../assets/images/blog/01.jpg"}
                                    className="img-fluid"
                                    alt=""
                                />

                                <div className="card-body">
                                    <p className="text-muted">{blog?.content}</p>
                                </div>
                            </div>
                        </div>
                        <BlogsSidebars />
                    </div>
                </div>
            </section>
            <Footer />
            <ScrollTop />
        </>
    );
}
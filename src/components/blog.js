import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";
import { blogData } from "../data/data";
import { FiClock, FiCalendar } from "../assets/icons/vander";

export default function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                // Replace with actual API endpoint to fetch blog detail by id
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

    return (
        <>
            <Navbar navClass="defaultscroll sticky" navLight={true} />
            <section className="section">
                <div className="container">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        <div className="row">
                            <div className="col-lg-8 col-md-7">
                                <div className="card blog blog-detail shadow rounded border-0">
                                    <div className="card-img blog-detail-image position-relative overflow-hidden rounded-0">
                                        <img
                                            src={blog.imageUrl} // Assuming imageUrl is part of blog object
                                            className="img-fluid"
                                            alt=""
                                        />
                                    </div>

                                    <div className="card-body blog-detail-content position-relative p-0">
                                        <div className="p-4">
                                            <ul className="list-unstyled text-muted small mb-2">
                                                <li className="d-inline-flex align-items-center me-2">
                                                    <FiCalendar className="fea icon-ex-sm me-1 text-dark" />
                                                    {blog.createdAt}
                                                </li>
                                            </ul>

                                            <h4 className="title fw-semibold fs-5 text-dark">
                                                {blog.title}
                                            </h4>

                                            <p className="text-muted">{blog.content}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
            <ScrollTop />
        </>
    );
}
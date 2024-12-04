import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function BlogsSidebars() {
    const [searchTerm, setSearchTerm] = useState("");
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecentBlogs = async () => {
            try {
                const response = await fetch("https://topjob-ojt-790cf940c139.herokuapp.com/blogs/recent");
                if (!response.ok) {
                    throw new Error("Failed to fetch recent blogs");
                }
                const data = await response.json();
                setRecentBlogs(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentBlogs();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredBlogs = recentBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const recentBlogsToShow = filteredBlogs.slice(0, 5);

    return (
        <div className="col-lg-4 col-md-6 col-12">
            <div className="card bg-white p-4 rounded shadow sticky-bar">
                <div>
                    <h6 className="pt-2 pb-2 bg-light rounded text-center">Search</h6>

                    <div className="search-bar mt-4">
                        <div id="itemSearch2" className="menu-search mb-0">
                            <form className="searchform">
                                <input
                                    type="text"
                                    className="form-control rounded border"
                                    name="s"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <input type="submit" />
                            </form>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-2">
                    <h6 className="pt-2 pb-2 bg-light rounded text-center">
                        Recent Post
                    </h6>
                    <div className="mt-4">
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>Error: {error}</p>
                        ) : (
                            recentBlogsToShow.map((item, index) => (
                                <div
                                    className="blog blog-primary d-flex align-items-center mt-3"
                                    key={index}
                                >
                                    <img
                                        src={item.imageUrl}
                                        className="avatar avatar-small rounded"
                                        style={{ width: "auto" }}
                                        alt=""
                                    />
                                    <div className="flex-1 ms-3">
                                        <Link
                                            to={`/blog-detail/${item.id}`} // Replace with actual link path
                                            className="d-block title text-dark fw-medium"
                                        >
                                            {item.title}
                                        </Link>
                                        <span className="text-muted small">{item.createdDate}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
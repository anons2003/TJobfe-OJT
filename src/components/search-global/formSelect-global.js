import React, { useState, useEffect } from "react";
import { FiSearch, FiMapPin, FiBriefcase, FiClock, FiCodesandbox, FiDollarSign } from "../../assets/icons/vander";
import { BsBuildingFill } from "react-icons/bs";
import ToggleSelect from "../ToggleSelect";
import api from '../../api/http';
import { Link } from "react-router-dom";

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


export default function FormSelect({ onSearch }) {
    const [keyword, setKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [allJobs, setAllJobs] = useState([]);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);  
    const [error, setError] = useState(null);
    const [searchInitiated, setSearchInitiated] = useState(false); // Để kiểm tra người dùng đã nhấn nút Search hay chưa

    const [categoriesOptions, setCategoriesOptions] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const jobCategoriesResponse = await api.get("/job-categories");
                const jobTypesResponse = await api.get("/job-types");
                const jobsResponse = await api.get("/jobs/getjob"); // Endpoint để lấy tất cả công việc

                setCategoriesOptions(jobCategoriesResponse.data.map(category => ({ value: category.jobCategoryId, label: category.jobCategoryName })));
                setTypeOptions(jobTypesResponse.data.map(type => ({ value: type.jobTypeId, label: type.jobTypeName })));
                setAllJobs(jobsResponse.data); // Lưu tất cả công việc vào state allJobs
            } catch (error) {
                console.error("Error fetching options: ", error);
            }
        };

        fetchOptions();
    }, []);

    const filterResults = () => {
        return allJobs.filter(job => {
            const matchesKeyword = keyword
                ? job.title.toLowerCase().includes(keyword.toLowerCase()) || job.enterprise.enterprise_name.toLowerCase().includes(keyword.toLowerCase())
                : true;

            const matchesCategory = selectedCategory
                ? job.jobCategoryEntity.jobCategoryId === selectedCategory.value
                : true;

            const matchesType = selectedType
                ? job.jobTypeEntity.jobTypeId === selectedType.value
                : true;

            return matchesKeyword && matchesCategory && matchesType;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSearchInitiated(true); // Đánh dấu rằng người dùng đã nhấn nút Search

        // Kiểm tra nếu tất cả các trường đều rỗng
        if (!keyword && !selectedCategory && !selectedType) {
            setResults([]);
            setIsLoading(false);
            setError('Vui lòng nhập từ khóa, chọn ngành nghề hoặc chọn loại công việc để tìm kiếm.');
            return;
        }

        try {
            const filteredJobs = filterResults();
            setResults(filteredJobs);
        } catch (error) {
            setError('Đã xảy ra lỗi khi lọc dữ liệu công việc.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <form className="card-body text-start" onSubmit={handleSubmit}>
                <div className="registration-form text-dark text-start">
                    <div className="row g-lg-0">
                        <div className="col-lg-3 col-md-6 col-12">
                            <div className="mb-3 mb-sm-0">
                                <label className="form-label d-none fs-6">Search :</label>
                                <div className="filter-search-form position-relative filter-border">
                                    <FiSearch className="fea icon-20 icons" />
                                    <input
                                        name="name"
                                        type="text"
                                        id="job-keyword"
                                        className="form-control filter-input-box bg-light border-0"
                                        placeholder="Search your keywords"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-12">
                            <div className="mb-3 mb-sm-0">
                                <label className="form-label d-none fs-6">Category:</label>
                                <div className="filter-search-form position-relative filter-border">
                                    <FiCodesandbox className="fea icon-20 icons" />
                                    <ToggleSelect
                                        options={categoriesOptions}
                                        value={selectedCategory}
                                        onChange={setSelectedCategory}
                                        placeholder='Select Category'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-12">
                            <div className="mb-3 mb-sm-0">
                                <label className="form-label d-none fs-6">Type :</label>
                                <div className="filter-search-form relative filter-border">
                                    <FiBriefcase className="fea icon-20 icons" />
                                    <ToggleSelect
                                        options={typeOptions}
                                        value={selectedType}
                                        onChange={setSelectedType}
                                        placeholder='Select Type'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-12">
                            <input
                                type="submit"
                                id="search"
                                name="search"
                                style={{ height: '60px' }}
                                className="btn btn-primary searchbtn w-100"
                                value="Search"
                            />
                        </div>
                    </div>
                </div>
            </form>

            <div>
                {isLoading && <div>Loading...</div>}
                {error && <div className="mess">{error}</div>}
                {results.length > 0 && (
                    <div className="search-results mt-4">
                        {results.map((item, index) => {
                            const createdAtDate = formatDateTime(item.createdDate);
                            const daysAgo = compareWithCurrentDate(createdAtDate);
                            return (
                                <div  key={index}>

                                    <div className="job-post job-post-list rounded shadow p-4 d-md-flex align-items-center justify-content-between position-relative">
                                        <div className="d-flex align-items-center w-250px">
                                            <div className="ms-3">
                                                <Link to={`/job-detail-three/${item.id}`} className="h5 title text-dark">{item.title}</Link>
                                                <span className="mt-3 m-3"><BsBuildingFill  />{item?.enterprise?.enterprise_name}</span>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between d-md-block mt-3 mt-md-0 w-100px">
                                            <span className="badge bg-soft-primary rounded-pill">{item.jobTime}</span>
                                            <span className="text-muted d-flex align-items-center fw-medium mt-md-2"><FiClock className="fea icon-sm me-1 align-middle" />{daysAgo} days ago</span>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between d-md-block mt-2 mt-md-0 w-130px">
                                            <span className="text-muted d-flex align-items-center"><FiMapPin className="fea icon-sm me-1 align-middle" />{item.state}</span>
                                            <span className="d-flex fw-medium mt-md-2"><FiDollarSign className="fea icon-sm text-primary me-1" />{item.maxSalary}/mo</span>
                                        </div>


                                        <div className="mt-3 mt-md-0">
                                            <Link to={`/job-detail-three/${item.id}`} className="btn btn-sm btn-primary w-full ms-md-1"> See Detail</Link>
                                        </div>

                                    </div>
                                </div>

                            )
                        })}
                    </div>
                )}

                {results.length > 4 && (
                    <div className="mt-3 text-center">
                        <Link to="/job-list-guest" className="btn btn-link">
                            See more related jobs
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

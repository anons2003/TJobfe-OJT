import React, { useState, useEffect } from "react";
import { FiBriefcase, FiMapPin, FiSearch } from "../assets/icons/vander";
import ToggleSelect from "./ToggleSelect";
import { State } from "country-state-city"; // Import the State module from the library
import api from "../api/http"; // Import your api instance

export default function FormSelect({ onSearch }) {
    const [keyword, setKeyword] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [jobCategories, setJobCategories] = useState([]);
    const [states, setStates] = useState([]);

    useEffect(() => {
        // Fetch job categories from the backend
        const fetchJobCategories = async () => {
            try {
                const response = await api.get("/job-categories");
                const categories = response.data.map(category => ({
                    value: category.jobCategoryId,
                    label: category.jobCategoryName,
                }));
                setJobCategories(categories);
            } catch (error) {
                console.error("Error fetching job categories:", error);
            }
        };

        fetchJobCategories();
    }, []);

  useEffect(() => {
    const vietnamStates = State.getStatesOfCountry("VN").map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));

    setStates(vietnamStates);
  }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({
          keyword,
          location: selectedLocation ? selectedLocation.label : null,
          Category: selectedCategory ? selectedCategory.value : null,
        });
    };

    return (
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
                            <label className="form-label d-none fs-6">Location:</label>
                            <div className="filter-search-form position-relative filter-border">
                                <FiMapPin className="fea icon-20 icons" />
                                <ToggleSelect
                                    options={states}
                                    value={selectedLocation}
                                    onChange={setSelectedLocation}
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
                                    options={jobCategories}
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
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
    );
}

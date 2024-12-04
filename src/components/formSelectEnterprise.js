import React, { useState, useEffect } from "react";
import { FiMapPin, FiSearch } from "../assets/icons/vander";
import ToggleSelect from "./ToggleSelect";
import { State } from "country-state-city";

export default function FormSelect({ onSearch }) {
  const [keyword, setKeyword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [states, setStates] = useState([]);

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
    });
  };

  return (
    <form className="card-body text-start" onSubmit={handleSubmit}>
      <div className="registration-form text-dark text-start">
        <div className="row g-lg-0">
          <div className="col-lg-4 col-md-6 col-12">
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

          <div className="col-lg-4 col-md-6 col-12">
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

          <div className="col-lg-4 col-md-6 col-12">
            <input
              type="submit"
              id="search"
              name="search"
              style={{ height: "60px" }}
              className="btn btn-primary searchbtn w-100"
              value="Search"
            />
          </div>
        </div>
      </div>
    </form>
  );
}

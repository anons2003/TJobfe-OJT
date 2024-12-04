import { useState, useEffect } from "react";
import Selector from "./Selector";
import { City, State, Country } from "country-state-city";
import { Col, Row } from "react-bootstrap";

function StateCitySelector({ stateName, setStateName, cityName, setCityName }) {
  let countryData = Country.getCountryByCode("VN");
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [country] = useState(countryData);

  useEffect(() => {
    setStateData(State.getStatesOfCountry(country?.isoCode));
  }, [country]);

  useEffect(() => {
    if (stateName) {
      const state = stateData.find((state) => state.name === stateName);
      if (state) {
        setCityData(City.getCitiesOfState(country?.isoCode, state.isoCode));
      } else {
        setCityData([]);
      }
    }
  }, [stateName, stateData, country]);

  useEffect(() => {
    if (cityName) {
      const city = cityData.find((city) => city.name === cityName);
      if (city) {
        setCityName(cityName);
      }
    }
  }, [cityName, cityData, setCityName]);

  return (
    <Row>
      <Col md={6} className="mb-3">
        <div>
          <label className="form-label fw-semibold">State:</label>
          <Selector
            data={stateData}
            selected={stateData.find((state) => state.name === stateName) || {}}
            setSelected={(state) => {
              setStateName(state.name);
              setCityName(""); // Clear city selection when state changes
            }}
          />
        </div>
      </Col>
      <Col md={6} className="mb-3">
        <div>
          <label className="form-label fw-semibold">City:</label>
          <Selector
            data={cityData}
            selected={cityData.find((city) => city.name === cityName) || {}}
            setSelected={(city) => setCityName(city.name)}
            disabled={!stateName} // Disable city selector if no state is selected
          />
        </div>
      </Col>
    </Row>
  );
}

export default StateCitySelector;

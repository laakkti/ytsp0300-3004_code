import { useState, useEffect } from "react";

import { Button, ButtonGroup, Container, Row, Col } from "react-bootstrap";

import useAxiosRequest from "../hooks/useAxiosRequest";
import CumulativeTemperatureGraph from "../components/CumulativeTemperatureGraph";
import CumulativePrecipitationGraph from "../components/CumulativePrecipitationGraph";

import "./grid.css";

/**
 * Displays weather-related data, including temperature and precipitation graphs.
 *
 * @param {string} baseUrl - The base URL for API requests.
 * @param {Object} config - Configuration settings for API requests.
 * @param {Object} geometry - The geometric data used for weather information.
 * @param {boolean} collapsed - Indicates whether the component is collapsed.
 * @param {number} height - The height of the weather graphs.
 * @returns {JSX.Element} A component displaying weather data and graphs.
 */

const Weather = ({ baseUrl, config, geometry, collapsed, height }) => {
  const [url, setUrl] = useState(null);
  const [params, setParams] = useState(null);
  const [params2, setParams2] = useState(null);
  const [params3, setParams3] = useState(null);
  const [mode, setMode] = useState("temp");

  const {
    data: tempData,
    loading,
    error,
  } = useAxiosRequest(url, config, params2);

  const {
    data: precipData,
    loading2,
    error2,
  } = useAxiosRequest(url, config, params);

  const {
    data: currentData,
    loading3,
    error3,
  } = useAxiosRequest(url, config, params3);

  function getData(baseUrl, geometry) {
    const startDate = "2023-07-01T00:00:00Z";
    const endDate = "2023-10-10T00:00:00Z";

    let params = {
      topic: "accumulated_precipitation",
      geometry: geometry,
      startDate: startDate,
      endDate: endDate,
    };
    setParams(params);

    setUrl(baseUrl + "/ndvi/api/v1/weather");

    let params2 = {
      topic: "accumulated_temperature",
      geometry: geometry,
      startDate: startDate,
      endDate: endDate,
    };
    setParams2(params2);

    let params3 = {
      topic: "current",
      geometry: geometry,
    };
    setParams3(params3);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        getData(baseUrl, geometry);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [geometry]);

  return (
    <Container fluid style={{ backgroundColor: "#021F2E" }}>
      {url && params && currentData && !collapsed && (
        <Row className="grid-line">
          <>
            <Col
              md={3}
              className="grid-line d-flex align-items-start ps-0 me-0"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "left",
                  color: "#00FFFF80",
                }}
              >
                <img
                  src={`https://openweathermap.org/img/wn/${currentData.weather[0].icon}.png`}
                  alt="Weather Icon"
                  style={{
                    width: "100px",
                    height: "100px",
                    marginRight: "10px",
                  }}
                />
                <div>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                    Temp: {currentData.main.temp} °C
                  </div>
                  <div style={{ fontSize: "16px" }}>
                    Feels: {currentData.main.feels_like} °C
                  </div>
                  <div style={{ fontSize: "16px" }}>
                    Min - Max: {currentData.main.temp_min} -{" "}
                    {currentData.main.temp_max} °C
                  </div>
                  <div>
                    <span style={{ fontSize: "14px" }}>Main:</span>
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {" "}
                      {currentData.weather[0].main}
                    </span>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} className="grid-line d-flex align-items-start">
              {mode === "temp"
                ? url &&
                  params2 &&
                  tempData && (
                    <CumulativeTemperatureGraph
                      data={tempData}
                      height={height}
                    />
                  )
                : url &&
                  params &&
                  precipData && (
                    <CumulativePrecipitationGraph
                      data={precipData}
                      height={height}
                    />
                  )}
            </Col>

            <Col className="grid-line d-flex align-items-start">
              <ButtonGroup size="sm" variant="success">
                <Button
                  onClick={() => setMode("temp")}
                  active={mode === "temp"}
                >
                  Temperature
                </Button>
                <Button
                  onClick={() => setMode("prec")}
                  active={mode === "prec"}
                >
                  Precipitation
                </Button>
              </ButtonGroup>
            </Col>
          </>
        </Row>
      )}
      {url && params && currentData && collapsed && (
        <>
          <Row className="grid-line">
            <Col
              xs={7}
              className="grid-line d-flex align-items-start ps-0 me-0"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "left",
                  color: "#FF2EFF",
                }}
              >
                <>
                  <img
                    className="grid-line"
                    src={`https://openweathermap.org/img/wn/${currentData.weather[0].icon}.png`}
                    alt="Weather Icon"
                    style={{
                      width: "54px",
                      height: "54px",
                      marginRight: "0px",
                      marginLeft: "0px",
                      padding: "0px",
                    }}
                  />
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                      Temp: {currentData.main.temp} °C
                    </div>
                    <div style={{ fontSize: "12px" }}>
                      Feels: {currentData.main.feels_like} °C
                    </div>
                    <div style={{ fontSize: "12px" }}>
                      Min - Max: {currentData.main.temp_min} -{" "}
                      {currentData.main.temp_max} °C
                    </div>
                    <div>
                      <span style={{ fontSize: "10px" }}>Main:</span>
                      <span style={{ fontSize: "10px", fontWeight: "bold" }}>
                        {" "}
                        {currentData.weather[0].main}
                      </span>
                    </div>
                  </div>
                </>
              </div>
            </Col>
            <Col className="d-flex justify-content-end">
              <ButtonGroup vertical size="sm">
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => setMode("temp")}
                  active={mode === "temp"}
                >
                  Temperature
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => setMode("prec")}
                  active={mode === "prec"}
                >
                  Precipitation
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          )}
          <Row>
            <Col xs={12}>
              {mode === "temp"
                ? url &&
                  params2 &&
                  tempData && (
                    <CumulativeTemperatureGraph
                      data={tempData}
                      height={height}
                      collapsed={collapsed}
                    />
                  )
                : url &&
                  params &&
                  precipData && (
                    <CumulativePrecipitationGraph
                      data={precipData}
                      height={height}
                      collapsed={collapsed}
                    />
                  )}
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Weather;

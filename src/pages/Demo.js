import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Badge,
  Button,
  Form,
  Stack,
} from "react-bootstrap";
import NDVICarousel from "../components/Carousel";
import MySlider from "../components/MySlider";
import Scale from "../components/Scale";

import OffCanvas from "../components/OffCanvas";
import NDVIValuesTable from "../components/NDVIValuesTable";

import useImageRequest from "../hooks/useImageRequest";

import "../App.css";
import "./grid.css";

import {
  ChevronLeft,
  ChevronRight,
  PauseFill,
  CaretRightFill,
  Gear,
} from "react-bootstrap-icons";
import { ChevronCompactUp } from "react-bootstrap-icons";

import { useRef } from "react";

import Chart from "./Chart";
import Statistics from "./Statistics";
import AreaOnMap from "./AreaOnMap";
import LocationOnMap from "./LocationOnMap";
import CompareYears from "./CompareYears";
import Weather from "./Weather";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import ActionBar from "../components/ActionBar";
import useDynamicRowHeight from "../hooks/useDynamicRowHeight";

/**
 * Represents the Demo component.
 *
 * @param {string} baseUrl - The base URL for API requests.
 * @param {Object} config - Configuration settings for the component.
 * @param {Object} data - The data object containing dates, area, and other relevant information.
 * @param {Object} geometry - The geometric data for rendering maps or other spatial visualizations.
 * @param {number} navbarHeight - The height of the navigation bar, used for layout calculations.
 * @returns {JSX.Element} The rendered component.
 */

function Demo({ baseUrl, config, data, geometry, navbarHeight }) {
  const [dates, setDates] = useState([]);
  const [years, setYears] = useState([]);
  const [datesOfYear, setDatesOfYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [area, setArea] = useState(0);
  const [geometryId, setGeometryId] = useState(null);
  const [imagesOfYear, setImagesOfYear] = useState([]);

  const [bottomBarOpen, setBottomBarOpen] = useState(false);

  const [initialized, setInitialized] = useState(false);

  let url = baseUrl + "/ndvi/api/v1/image/";
  const { imageData, loading, error } = useImageRequest(
    url,
    geometryId,
    config
  );

  const rowRef = useRef(null);
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

 const { lastRowHeight,calculatingHeight } = useDynamicRowHeight(rowRef, initialized);

  const [_loading, setLoading] = useState(false);

  useEffect(() => {
    if (data && data.dates !== undefined) {
      setDates(data.dates);

      let years = getYears(data.dates);

      setYears(years);

      setGeometryId(data.id);

      let doy = getDatesOfYear(data.dates, years[0]);
      setDatesOfYear(doy);

      const _selectedDate = doy[0];

      setSelectedDate(new Date(_selectedDate.generationtime).toLocaleString());
      setSelectedIndex(0);
      setActiveIndex(doy.length - 1);

      setArea((data.area / 10000).toFixed(2));
    }
  }, [data]);

  useEffect(() => {
    function setData() {
      setSelectedYear(years[0]);
    }
    if (imageData.length > 0 && years.length > 0) {
      setData();
    }
  }, [imageData]);


  const getDatesOfYear = (dates, year) => {
    let dao = dates.filter((item) => {
      return new Date(item.generationtime).getFullYear() === year;
    });

    return dao;
  };

  const getImagesOfYear = (images, year) => {
    let imagesOfYear = images.filter((item) => {
      let dt = new Date(item.id.split("_")[0]);
      return dt.getFullYear() === year;
    });

    return imagesOfYear;
  };

  const getYears = (dates) => {
    let years = [
      ...new Set(
        dates.map((date) => new Date(date.generationtime).getFullYear())
      ),
    ];

    return years;
  };

  useEffect(() => {
    let doy = getDatesOfYear(dates, selectedYear);
    let images = getImagesOfYear(imageData, selectedYear);

    setSelectedIndex(0);

    setDatesOfYear(doy);

    if (images.length > 0) {
      setImagesOfYear(images);
      setSelectedImage(doy[0].sentinelid);
    }
  }, [selectedYear]);

  useEffect(() => {
    setActiveIndex(datesOfYear.length - 1);
  }, [imagesOfYear]);

  const changeDate = (_selectedIndex) => {
    let maxIndex = datesOfYear.length - 1;
    let minIndex = 0;

    if (_selectedIndex === "-" && selectedIndex < maxIndex) {
      _selectedIndex = selectedIndex + 1;
    } else if (_selectedIndex === "+" && selectedIndex > minIndex) {
      _selectedIndex = selectedIndex - 1;
    }

    if (
      _selectedIndex !== selectedIndex &&
      _selectedIndex !== "+" &&
      _selectedIndex !== "-"
    ) {
      const selectedDate = datesOfYear[_selectedIndex];

      setSelectedIndex(_selectedIndex);
      setSelectedImage(selectedDate.sentinelid);

      setActiveIndex(datesOfYear.length - _selectedIndex - 1);
    }
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const [interval, setInterval] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);

  const onSelect = (index, e) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
    changeDate(imagesOfYear.length - index - 1);
  };

  function setIndex(index) {
    setActiveIndex(index);
    changeDate(datesOfYear.length - index - 1);
  }

  function onChange(value) {
    if (interval !== value) {
      setInterval(value);
    }
  }

  function playClick() {
    setIsRunning(!isRunning);
  }

  const [page, setPage] = useState("Chart");

  const checkPlacement = (target) => {
    if (target.current) {
      const rect = target.current.getBoundingClientRect();

      const availableLeftSpace = rect.x;

      const minPopoverWidth = 200;

      return availableLeftSpace >= minPopoverWidth ? "left" : "right";
    } else {
      return "right";
    }
  };

  const sliderPopover = (
    <Popover
      style={{ width: "200px" }}
      className="bg-dark"
      data-bs-theme="light"
    >
      <Popover.Body>
        <MySlider
          min={1000}
          max={10000}
          step={1000}
          value={interval}
          callBack={onChange}
        />
      </Popover.Body>
    </Popover>
  );

  const [scaleHeight, setScaleHeight] = useState(null);
  const element1Ref = useRef(null);

  let collapsed = false;

  if (buttonRef.current) {
    collapsed = window.getComputedStyle(buttonRef.current).display === "none";
  }

  useEffect(() => {
    const activate = () => {
      //setInitialized(true;
      setInitialized(!initialized);
    };

    const timer = setTimeout(activate, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container fluid className="App grid-line3">
      {imagesOfYear.length > 0 && (
        <Row
          className="justify-content-center"
          style={{ height: "auto", marginTop: "4.7rem" }}
          xs="auto"
        >
          <Col xs={12} md={4} className="grid-line">
            <Stack
              direction="horizontal"
              gap={0}
              className="justify-content-md-center"
            >
              <Col>
                {buttonRef.current && (
                  <NDVICarousel
                    imageData={imagesOfYear}
                    activeIndex={activeIndex}
                    interval={isRunning ? interval : null}
                    callBack={onSelect}
                    mobile={collapsed}
                  />
                )}
              </Col>

              {imagesOfYear[activeIndex] && (
                <div className="mb-2 ms-2">
                  <Scale
                    params={imagesOfYear[activeIndex].scale}
                    width={30}
                    height={250}
                  />

                  <Badge className="ms-0 mt-1 mt-md-2" bg="success">
                    {area}
                  </Badge>
                </div>
              )}
            </Stack>
          </Col>

          <Col
            xs={12}
            md={3}
            className="d-flex flex-column justify-content-end align-items-start mb-md-5" // Uses Bootstrap classes
          >
            <Row
              className="order-2 order-md-1 d-none d-md-block"
              ref={buttonRef}
            >
              <Col xs={2} className="grid-line mb-0 pb-0 ">
                <NDVIValuesTable data={imagesOfYear[activeIndex]} />
              </Col>
            </Row>

            <Row
              xs="auto"
              className="d-flex align-items: flex-end grid-line mt-1 order-1 order-md-2"
            >
              <Stack
                direction="horizontal"
                gap={0}
                className="justify-content-md-center grid-line"
              >
                <Button
                  size="sm"
                  onClick={playClick}
                  id="play"
                  variant="outline-warning"
                  style={{ fontWeight: "bold" }}
                >
                  {isRunning ? (
                    <PauseFill color="white" size={19} />
                  ) : (
                    <CaretRightFill color="white" size={19} />
                  )}
                </Button>
                <OverlayTrigger
                  trigger="click"
                  placement={checkPlacement(popoverRef)}
                  overlay={sliderPopover}
                  rootClose={true}
                >
                  <Button
                    ref={popoverRef}
                    size="sm"
                    variant="outline-primary"
                    id=""
                    style={{ fontWeight: "bold" }}
                  >
                    <Gear color="white" size={18} />
                  </Button>
                </OverlayTrigger>
                <Button
                  size="sm"
                  variant="outline-primary"
                  id="-"
                  style={{ fontWeight: "bold" }}
                  onClick={() => changeDate("-")}
                >
                  <ChevronLeft color="white" size={20} />
                </Button>

                <Form.Select
                  size="sm"
                  className="me-1"
                  style={{ width: "auto" }} //,borderStyle: "none"
                  value={selectedImage}
                  onChange={(e) => {
                    changeDate(e.target.selectedIndex);
                  }}
                >
                  {datesOfYear.map((item, index) => {
                    return (
                      <option key={index} value={item.sentinelid}>
                        {new Date(item.generationtime).toLocaleDateString()}
                      </option>
                    );
                  })}
                </Form.Select>

                <Form.Select
                  size="sm"
                  style={{
                    width: "auto",
                    backgroundColor: "#D1E7DE",
                    color: "rgba(0, 0, 0)",
                  }}
                  value={selectedYear}
                  onChange={(e) => {
                    let year = parseInt(e.target.value);

                    setSelectedYear(year);
                  }}
                >
                  {years.map((item, index) => {
                    return (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </Form.Select>

                <Button
                  size="sm"
                  variant="outline-primary"
                  id="-"
                  style={{ fontWeight: "bold" }}
                  onClick={() => changeDate("+")}
                >
                  <ChevronRight color="white" size={18} />
                </Button>
              </Stack>
            </Row>
          </Col>
        </Row>
      )}
      <Row ref={rowRef} className="grid-line">
        <Col xs={12} md={12} className="mt-0 mb-2">
          <ActionBar page={page} setPage={setPage} />
        </Col>
      </Row>
      {/*</div>*/}
      {imagesOfYear.length > 0 && buttonRef.current && !calculatingHeight &&(
        <Row
          className="grid-line2 justify-content-center"
          style={{
            height: !collapsed
              ? `${lastRowHeight - 25}px`
              : `${lastRowHeight}px`,

            overflow: "auto",
          }}
        >
          {page === "Chart" && (
            <Chart
              datesOfYear={datesOfYear}
              selectedIndex={selectedIndex}
              callBack={changeDate}
              height={!collapsed ? lastRowHeight - 27 : lastRowHeight - 10}
              collapsed={collapsed}
            />
          )}

          {page === "CompareYears" && (
            <CompareYears
              dates={dates}
              selectedYear={selectedYear}
              selectedDate={datesOfYear[selectedIndex]}
              //height={collapsed ? 370 : 378}
              height={!collapsed ? lastRowHeight - 27 : lastRowHeight - 8}
            />
          )}

          {page === "Statistics" && (
            <Statistics
              data={imagesOfYear}
              selectedIndex={activeIndex}
              setSelectedIndex={setIndex}
            />
          )}

          {page === "AreaOnMap" && (
            <AreaOnMap
              geometry={geometry}
              imageUrl={imagesOfYear[activeIndex].image.dataUrl}
              date={selectedDate}
              satellite={true}
            />
          )}

          {page === "Location" && <LocationOnMap geometry={geometry} />}

          {page === "Weather" && (
            <Weather
              baseUrl={baseUrl}
              config={config}
              geometry={geometry}
              collapsed={collapsed}
              height={!collapsed ? lastRowHeight - 27 : lastRowHeight - 120}
            />
          )}
        </Row>
      )}

      <OffCanvas
        imagesOfYear={imagesOfYear}
        activeIndex={activeIndex}
        setIndex={setIndex}
        show={bottomBarOpen}
        visible={setBottomBarOpen}
        collapsed={collapsed}
      />
      <div className="position-absolute bottom-0 end-0 me-2 mb-2">
        <Button
          size="sm"
          variant="outline-info"
          onClick={() => setBottomBarOpen(true)}
        >
          <ChevronCompactUp color="darkcyan" size={20} />
        </Button>
      </div>
    </Container>
  );
}

export default Demo;

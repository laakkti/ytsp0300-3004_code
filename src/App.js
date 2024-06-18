import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Navbar,
  Nav,
  Container,
  Form,
  Button,
  Dropdown,
  InputGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // import Bootstrap CSS
import {
  List,
  Search,
  Fullscreen,
  FullscreenExit,
} from "react-bootstrap-icons";

import "./App.css";
import OnProgressModal from "./components/OnProgressModal";
import LoginDialog from "./components/login/LoginDialog";
import userService from "./services/user-service";
import Demo from "./pages/Demo";
import "./css/navigations.css";
import Tractor from "./img/tractor.svg";
import startImage from "./img/start.jpg";
import BGimage from "./components/BGimage";
import ConfirmModal from "./components/ConfirmModal";
import useFetchDatesList from "./hooks/useFetchDatesList";
import { useFullscreen } from "./hooks/useFullscreen";
import logo from "./logobrand.png";


function App() {
  const [aoiList, setAoiList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [geometry, setGeometry] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [getWeather, setGetWeather] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [name, setName] = useState("");
  const [loginDialog, setLoginDialog] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState("");
  const [admin, setAdmin] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const appRef = useRef(null);
  const navbarRef = useRef(null);

  let baseUrl = "";

  if (process.env.NODE_ENV !== "production") {
    baseUrl = "http://localhost:5000";
  }

  let startDate = "2013-04-01T00:00:00Z";
  startDate = "2021-04-01T00:00:00Z"; // huom kasvukausi määrittely backendissä!!!!
  let endDate = new Date().toISOString();

  /**
   * Get configuration for API requests.
   *
   * @returns {Object} The configuration object with headers.
   */
  const getConfig = () => {
    let _token = `bearer ${token}`;

    return { headers: { Authorization: _token } };
  };

  const { data, loading } = useFetchDatesList(
    geometry,
    baseUrl,
    startDate,
    endDate,
    getConfig()
  );

  useEffect(() => {
    if (!geometry) {
      return;
    }

    /**
     * Update NDVI status for the selected geometry.
     *
     * @async
     */
    async function handleNDVIUpdate() {
      try {
        const res = await axios.post(
          baseUrl + "/ndvi/api/v1/setWorkareaNDVIStatus",
          {
            geometry: geometry,
            status: true,
          },
          getConfig()
        );

        if (res.status === 200) {
          const obj = aoiList.find((item) => item.id === selectedItem.id);
          if (obj) {
            obj.ndvi = true;
          }
        }
      } catch (error) {
        console.error("Error updating NDVI status:", error);
      }
    }

    if (geometry) {
      handleNDVIUpdate();
    }
  }, [geometry]);

  useEffect(() => {
    /**
     * Fetch weather data for the selected geometry.
     *
     * @async
     */
    const fetchWeather = async () => {
      let res = await axios.post(baseUrl + "/weather", {
        geometry: geometry,
      });

      let data = res.data;

      setWeatherData(data);
    };

    if (getWeather) {
      setGetWeather(false);

      fetchWeather();
    }
  }, [getWeather]);

  useEffect(() => {
    /**
     * Fetch the list of AOIs (Areas of Interest).
     *
     * @async
     */
    const getBlocks = async () => {
      const config = getConfig();
      let res = await axios.get(baseUrl + "/ndvi/api/v1/aois", config);

      if (res.status === 200) {
        let _aoiList = res.data;
        _aoiList.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setAoiList(_aoiList);
      }
    };

    async function _getBlocks() {
      await getBlocks();
    }

    if (token) {
      _getBlocks();
    }
  }, [token]);

  /**
   * Callback function to handle various events.
   *
   * @param {string} topic - The topic of the event.
   * @param {any} data - The data associated with the event.
   * @returns {string} A response string.
   */
  const callBack = async (topic, data) => {
    if (topic === "weather") {
      setGetWeather(true);
    } else if (topic === "updateBlocks") {
      // Handle updateBlocks event
    } else {
      setImageId(data);
    }

    return "hello";
  };

  const [page, setPage] = useState("Demo");

  let searchCriteria = "name";

  useEffect(() => {
    if (searchTerm !== "") {
      const newResults = aoiList.filter((option) =>
        option[searchCriteria]
          .toLowerCase()
          .startsWith(searchTerm.toLowerCase())
      );

      setResults(newResults);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  /**
   * Handle search term change.
   *
   * @param {Object} event - The change event.
   */
  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;

    setSearchTerm(newSearchTerm);
  };

  /**
   * Handle key down event.
   *
   * @param {Object} event - The key down event.
   */
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  /**
   * Handle the selection of an item from the search results.
   *
   * @param {Object} item - The selected item.
   */
  const handleSelect = (item) => {
    setSelectedItem(item);
    setSearchTerm("");
    setName(item.name);
    setExpanded(false);

    setGeometry(item.geometry);
  };

  /**
   * Handle user registration.
   *
   * @async
   * @param {Object} user - The user data.
   * @returns {Object} The response data.
   */
  const handleRegister = async (user) => {
    const data = await userService.register(user, baseUrl + "/ndvi/api/v1/");

    return data;
  };

  /**
   * Handle user login.
   *
   * @async
   * @param {number} id - The identifier for the login type.
   * @param {Object} data - The login data.
   * @param {Function} func - The callback function.
   * @returns {Object|null} The response data or null.
   */
  const handleLogin = async (id, data, func) => {
    if (id === 1) {
      if (data !== null) {
        const response = await userService.login(
          data,
          baseUrl + "/ndvi/api/v1/"
        );

        if (response !== null) {
          if (response.code === 200) {
            setUser(response.data.firstname + " " + response.data.lastname);
            setAdmin(response.data.admin);
            setToken(response.data.token);
            setPage("Demo");
          }
          return response;
        } else {
          return null;
        }
      }
    } else if (id === 2) {
      return await handleRegister(data);
    }
  };

  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const buttonRef = useRef(null);

  return (
    <Container id="App" fluid className="App" ref={appRef}>
      {!geometry && token && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={Tractor}
            width="40%"
            style={{ marginTop: "150px" }}
            alt=""
          />
        </div>
      )}
      <ConfirmModal show={confirmShow} onHide={() => setConfirmShow(false)} />

      <LoginDialog
        _show={loginDialog}
        showDialog={setLoginDialog}
        func={handleLogin}
      ></LoginDialog>
      <BGimage show={!token} image={startImage} />

      <>
        <Navbar
          ref={navbarRef}
          collapseOnSelect
          fixed="top"
          bg="dark"
          expand="lg"
          data-bs-theme="dark"
          className="justify-content-right"
          expanded={expanded}
        >
          <Navbar.Brand href="#home">
            <img
              src={logo}
              width="35"
              height="35"
              alt="Logo"
              style={{ marginLeft: "10px" }}
            />
          </Navbar.Brand>
          <Navbar.Toggle
            ref={buttonRef}
            aria-controls="responsive-navbar-nav"
            onClick={() => setExpanded(expanded ? false : "expanded")}
          >
            <List />
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            {token && (
              <>
                <Nav className="mr-auto">
                  <Form className="d-flex mt-1 mb-1">
                    <Dropdown show={results.length > 0}>
                      <Dropdown.Menu>
                        {results.map((result) => (
                          <Dropdown.Item
                            style={{ color: result.ndvi ? "#68cbf8" : "" }}
                            key={result.id}
                            onClick={() => handleSelect(result)}
                          >
                            {result.name}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>

                    <InputGroup className="ms-3" style={{ height: "38px" }}>
                      <InputGroup.Text id="basic-addon1">
                        <Search color="white" size={22} />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="name of the area"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                      />
                    </InputGroup>

                    <Form.Select
                      aria-label=""
                      style={{ width: "auto", height: "38px" }}
                      disabled
                    >
                      <option value="name" selected>
                        name
                      </option>
                      <option value="workareaid">workareaid</option>
                    </Form.Select>
                  </Form>
                </Nav>

                <Nav.Link
                  style={{
                    fontSize: "20px",
                    color: "#68cbf8",
                    marginLeft: "20px",
                  }}
                >
                  {name}
                </Nav.Link>

                <Nav variant="pills">
                  <div style={{ width: "75px" }}></div>
                  <Nav.Link
                    onClick={() => setPage("Demo")}
                    active={page === "Demo"}
                  >
                    Demo
                  </Nav.Link>

                  {admin && (
                    <>
                      <Nav.Link onClick={() => setPage("Tools")}>
                        Tools
                      </Nav.Link>

                      <Nav.Link onClick={() => setPage("Tests")}>
                        Tests
                      </Nav.Link>
                      <Nav.Link
                        onClick={() => setPage("UpdateAllNDVIs")}
                        active={page === "UpdateAllNDVIs"}
                      >
                        UpdateDB
                      </Nav.Link>
                    </>
                  )}
                  <Nav.Link onClick={() => setConfirmShow(true)}>
                    About
                  </Nav.Link>
                </Nav>
              </>
            )}

            {!token && (
              <Nav className="ms-0">
                <div
                  className="mt-1"
                  style={{ color: "#B2B7BA", fontSize: "20px" }}
                >
                  NDVI demo for agriculture
                </div>
              </Nav>
            )}

            <Nav className="ms-auto me-2">
              {token && (
                <div className="me-2 mt-2" style={{ color: "darkCyan" }}>
                  {user}
                </div>
              )}

              <Button
                variant="outline-secondary"
                className="me-2 border-0"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <FullscreenExit color="#0d6efd" size={20} />
                ) : (
                  <Fullscreen color="#0d6efd" size={20} />
                )}
              </Button>

              <Button
                variant={token ? "outline-info" : "outline-warning"}
                onClick={() => {
                  if (token) {
                    setToken(false);
                    setPage(null);
                    setGeometry(null);
                    setName(null);
                  } else {
                    setLoginDialog(true);
                  }
                }}
              >
                {token ? "Log out" : "Log in"}
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </>

      <OnProgressModal show={loading} message={"Loading..."} />
      {page === "Demo" && geometry && !loading && (
        <Demo
          baseUrl={baseUrl}
          config={getConfig()}
          callBack={callBack}
          data={data}
          geometry={geometry}
          mobile={buttonRef.current}
          navbarHeight={navbarRef.current.clientHeight}
        />
      )}

      {/*
      {page === "Tools" && aoiList && (
        <Tools
          baseUrl={baseUrl}
          config={getConfig()}
          aoiList={aoiList}
          geometry={geometry}
          callBack={callBack}
        />
      )}

      {page === "Tests" && (
        <Tests
          baseUrl={baseUrl}
          config={getConfig()}
          callBack={callBack}
          data={data}
          geometry={geometry}
        />
      )}

      {page === "UpdateAllNDVIs" && aoiList && (
        <UpdateAllNDVIs
          aoiList={aoiList}
          baseUrl={baseUrl}
          config={getConfig()}
          startDate={startDate}
          endDate={endDate}
          callBack={callBack}
        />
      )}
    */}
    </Container>
  );
}

export default App;

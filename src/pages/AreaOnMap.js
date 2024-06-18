import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { MapContainer, TileLayer, ImageOverlay, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FullscreenControl } from "react-leaflet-fullscreen";
import "react-leaflet-fullscreen/styles.css";

var get_bounding_box = require("@turf/bbox").default;

/**
 * Displays an area on a map with an optional image overlay.
 * 
 * @param {Object} geometry - GeoJSON object defining the area to display.
 * @param {string} imageUrl - URL of the image to overlay on the map.
 * @param {Date} date - Date associated with the image or area.
 * @param {boolean} satellite - Flag to toggle between satellite and map view.
 * @returns {JSX.Element} A container with the Map and optional image overlay.
 */

const AreaOnMap = ({ geometry, imageUrl, date, satellite }) => {
  const [bounds, setBounds] = useState("");
  const [center, setCenter] = useState(null);
  const [mapMode, setMapMode] = useState(true); // satellite

  const [mapKey, setMapKey] = useState(0);

  const [_imageUrl, _setImageUrl] = useState(false);

  useEffect(() => {
    if (geometry) {
      let bbox = get_bounding_box(geometry);

      setMapKey((prevKey) => prevKey + 1);

      setCenter(getCenterPoint(bbox));

      setBounds([
        [bbox[1], bbox[2]],
        [bbox[3], bbox[0]],
      ]);
    }
  }, [geometry]);

  const handleType = () => {
    setMapMode(!mapMode);
  };

  function getCenterPoint(bbox) {
    const centerX = (bbox[0] + bbox[2]) / 2;
    const centerY = (bbox[1] + bbox[3]) / 2;
    return [centerY, centerX];
  }

  return (
    <Container fluid style={{ width: "100%", height: "100%" }}>
      {center && (
        <>
          <MapContainer
            key={mapKey}
            center={center}
            zoom={15}
            scrollWheelZoom={false}
            style={{ width: "100%", height: "100%" }}
          >
            {!mapMode ? (
              <TileLayer
                attribution="Google Maps"
                url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
              />
            ) : (
              <TileLayer
                url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
              />
            )}

            {imageUrl && bounds && (
              <ImageOverlay url={imageUrl} bounds={bounds} />
            )}

            <FullscreenControl position="topright" forceSeparateButton={true} />
          </MapContainer>
        </>
      )}
    </Container>
  );
};

export default AreaOnMap;

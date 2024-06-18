import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

import { FullscreenControl } from "react-leaflet-fullscreen";
import "react-leaflet-fullscreen/styles.css";

/**
 * Displays a map with a marker indicating a specific location.
 *
 * @param {Object} geometry - The geometric data used to calculate the center point for the map and marker.
 * @returns {JSX.Element} A map container with a marker and popup displaying the location's coordinates.
 */

const LocationOnMap = ({ geometry }) => {
  const [center, setCenter] = useState(null);
  const [icon, setIcon] = useState(null);

  const LeafIcon = L.Icon.extend({
    options: {},
  });

  var get_bounding_box = require("@turf/bbox").default;

  let finlandBounds = [
    [60.15504, 20.6455928891],
    [65.012, 19.995],
  ];

  useEffect(() => {
    const greenIcon = new LeafIcon({
      iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    });

    setIcon(greenIcon);
  }, []);

  useEffect(() => {
    if (geometry) {
      let bbox = get_bounding_box(geometry);
      setCenter(getCenterPoint(bbox));
    }
  }, [geometry]);

  function getCenterPoint(bbox) {
    const centerX = (bbox[0] + bbox[2]) / 2;
    const centerY = (bbox[1] + bbox[3]) / 2;
    return [centerY, centerX];
  }

  const MapView = ({ center }) => {
    const map = useMap();

    useEffect(() => {
      if (center) {
        const viewCenter = L.latLng(center[0] - 0.0, center[1]);
        map.setView(viewCenter, 7);
      }
    }, [center]);

    return null;
  };

  return (
    <>
      {center && (
        <Container fluid>
          <div>
            <MapContainer
              center={center}
              zoom={4}
              scrollWheelZoom={false}
              style={{ width: "100%", height: "48vh" }}
            >
              <TileLayer
                attribution="Google Maps"
                url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
              />

              <Marker position={center} icon={icon}>
                <Popup>
                  <>
                    {center[0].toFixed(5)}, {center[1].toFixed(5)}
                  </>
                </Popup>
              </Marker>
              <MapView center={center} />
              <FullscreenControl
                position="topright"
                forceSeparateButton={true}
              />
            </MapContainer>
          </div>
        </Container>
      )}
    </>
  );
};

export default LocationOnMap;

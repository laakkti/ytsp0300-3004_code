import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Custom hook for fetching a list of dates with NDVI data.
 * 
 * @param {Object} geometry - The geometric data for the NDVI query.
 * @param {string} baseUrl - The base URL for the NDVI data API.
 * @param {string} startDate - The start date for the NDVI data query.
 * @param {string} endDate - The end date for the NDVI data query.
 * @param {Object} config - Axios configuration options (token in header) for the request.
 * @returns {Object} An object containing the following properties:
 *                   - `data`: The fetched data or `null` if not yet retrieved or in case of an error.
 *                   - `loading`: A boolean indicating the loading state of the request.
 */

const useFetchDatesList = (geometry, baseUrl, startDate, endDate, config) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          baseUrl + "/ndvi/api/v1/list",
          {
            geometry: geometry,
            start_date: startDate,
            end_date: endDate,
          },
          config
        );

        if (res.status === 200) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Error: ", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (geometry) {
      fetch();
    }
  }, [geometry]);

  return { data, loading };
};

export default useFetchDatesList;

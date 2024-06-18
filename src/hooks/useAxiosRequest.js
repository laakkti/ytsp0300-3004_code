import { useState, useEffect } from "react";
import axios from "axios";

/**
 * A custom hook for making Axios requests.
 *
 * @param {string} url - The URL for the request.
 * @param {object} config - Configuration options for Axios, token in header.
 * @param {object} params - Parameters to send with the request.
 * @param {Function} callBack - A callback function (optional).
 * @returns {object} - An object with data, loading, and error properties.
 */

const useAxiosRequest = (url, config, params, callBack) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await axios.post(url, params, config);
        setData(res.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (url && params) {
      fetchData();
    }
  }, [url, params, callBack]);

  return { data, loading, error };
};

export default useAxiosRequest;

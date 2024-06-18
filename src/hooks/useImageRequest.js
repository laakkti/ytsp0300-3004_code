import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Custom hook for fetching image data from a server.
 *
 * @param {string} url - The base URL for the image request.
 * @param {string} imageId - The unique identifier for the image.
 * @param {Object} config - The Axios configuration options (token in header) for the request.
 * @returns {Object} An object containing:
 *                   - `imageData`: An array of image data or an empty array if no data is fetched.
 *                   - `loading`: A boolean indicating the loading state of the request.
 *                   - `error`: An error object if the request fails, otherwise `null`.
 */

const useImageRequest = (url, imageId, config) => {
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      try {
        const params = { all: true };
        let res = await axios.get(url + imageId, { params, ...config });

        setImageData(res.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (imageId) {
      fetch();
    }
  }, [imageId]);

  return { imageData, loading, error };
};

export default useImageRequest;

import axios from 'axios'

/**
 * Attempts to log in a user.
 * @param {Object} user - The user credentials.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Promise<Object>} A promise that resolves to an object containing the response code and data.
 */

const login = async (user,baseUrl) => {
  
  try {

    const _response = await axios.post(baseUrl + 'login', user);

    const response = {
      code: _response.status,
      data: _response.data
    }

    return response;

  } catch (exception) {

    let error = exception.response;

    if (error !== undefined) {

      let response = {
        code: error.status,
        message: error.data.error
      }

      return response;
    } else {

      return null;
    }

  }

}

/**
 * Registers a new user.
 * @param {Object|null} newUser - The new user's information.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the response code and message, or null if newUser is null.
 */

const register = async (newUser, baseUrl) => {

  if (newUser === null) {
    return null
  }

  try {

    const response = await axios.post(baseUrl + 'register', newUser);

    let _response = {
      code: response.status,
      message: response.data.message
    }

    return _response;

  } catch (exception) {

    let error = exception.response;

    let response = {
      code: error.status,
      message: error.data.error
    }
    return response;
  }

}

export default { login, register }
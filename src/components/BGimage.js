import React from "react";

/**
 * BGimage component that conditionally renders a background image.
 * 
 * @param {boolean} show - Determines if the image should be displayed.
 * @param {string} image - The source URL of the image to be displayed.
 * @returns {React.ReactElement|null} The React element for the background image or null.
 */

function BGimage({ show, image }) {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const imageStyle = {
    maxWidth: "100%",
    maxHeight: "80vh",
  };

  return show ? (
    <div style={containerStyle}>
      <img src={image} alt="Centered Image" style={imageStyle} />
    </div>
  ) : null;
}

export default BGimage;

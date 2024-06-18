/**
 * A ToastMsg component that displays a message in a toast notification.
 * 
 * @param {boolean} show - Controls the visibility of the toast.
 * @param {function} close - Function to call when the toast is closed.
 * @param {Object} params - Parameters for the toast, including styles and content.
 * @param {Object} params.style - Style settings for the toast.
 * @param {string} params.style.backgroundcolor - Background color of the toast.
 * @param {string} params.style.color - Text color of the toast.
 * @param {boolean} params.autohide - Whether the toast should autohide.
 * @param {number} params.delay - Delay in ms before the toast autohides.
 * @param {string} params.header - Header content of the toast.
 * @param {string} params.message - Body content of the toast.
 * @returns {React.ReactElement} A styled toast component with header and body.
 */

import React from "react";
import { Toast } from "react-bootstrap";

const ToastMsg = ({ show, close, params }) => {
  const style = {
    backgroundColor: params.style.backgroundcolor,
    color: params.style.color,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const headerStyle = {
    backgroundColor: "#282A36",
    color: "white",
  };

  return (
    <div>
      {params.autohide && (
        <Toast
          style={style}
          onClose={() => close()}
          show={show}
          delay={params.delay}
          autohide
        >
          <Toast.Header style={headerStyle}>
            <strong className="mr-auto">{params.header}</strong>
          </Toast.Header>
          <Toast.Body>{params.message}</Toast.Body>
        </Toast>
      )}
      {!params.autohide && (
        <Toast style={style} onClose={() => close()} show={show}>
          <Toast.Header>
            <strong className="mr-auto">{params.header}</strong>
          </Toast.Header>
          <Toast.Body>{params.message}</Toast.Body>
        </Toast>
      )}
    </div>
  );
};
export default ToastMsg;

import React, { useEffect, useState } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";

/**
 * Displays a modal with a spinner indicating progress and a message.
 * The modal also shows the running time since it was displayed.
 *
 * @param {boolean} show - Controls the visibility of the modal.
 * @param {string} message - The message to display alongside the spinner.
 */

const OnProgressModal = ({ show, message }) => {
  const [runningTime, setRunningTime] = useState(0);

  useEffect(() => {
    let intervalId;

    if (show) {      
      intervalId = setInterval(() => {
        setRunningTime((prevTime) => prevTime + 1);

      }, 1000);
    } else {
      clearInterval(intervalId);
      setRunningTime(0);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [show]);

  return (
    <Modal show={show} size="sm" backdrop="static" keyboard={false} centered>
      <Button variant="primary" disabled>
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        <span>&nbsp;&nbsp;&nbsp;</span>
        {runningTime > 0 ? (
          <>
            {message} ({runningTime} sec)
          </>
        ) : (
          <>{message}</>
        )}
      </Button>
    </Modal>
  );
};

export default OnProgressModal;
import React, { useEffect, useState } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";

/**
 * Displays a modal with a spinner indicating progress and a message.
 * The modal also shows the running time since it was displayed.
 *
 * @param {boolean} show - Controls the visibility of the modal.
 * @param {string} message - The message to display alongside the spinner.
 */

const OnProgressModalv2 = ({ show, message }) => {
  const [runningTime, setRunningTime] = useState(0);

  useEffect(() => {
    
  }, [show,message]);

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
    
          <>
            {message}
          </>
    
      </Button>
    </Modal>
  );
};

export default OnProgressModalv2;

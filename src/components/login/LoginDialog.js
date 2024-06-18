import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import ToastMsg from "./ToastMsg";
import RegisterForm from "./RegisterForm";

const LoginDialog = ({ _show, showDialog, func}) => {
  let _labels = {
    title: "Log in",
    btnClose: "Close",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [labels, setLabels] = useState(_labels);

  const [showToast, setShowToast] = useState(false);

  const handleClose = () => {};

  const [message, setMessage] = useState({
    header: "",
    message: "",
    autohide: false,
    delay: 0,
    style: {
      backgroundcolor: "#C5D4CD",
      color: "black",
    },
});

  useEffect(() => {
    setLabels(labels);
    setShow(_show);
    if (!_show) {
      setShowRegister(false);
    }
  }, [_show, labels]);

  const showRegisterForm = (p) => {
    regLabels();
    setShowRegister(p);
  };

  const regLabels = () => {
    let _labels = {
      title: "Sign up",
      btnClose: "Close",
    };
    setLabels(_labels);
  };

  const logLabels = () => {
    let _labels = {
      title: "Login",
      btnClose: "Close",
    };
    setLabels(_labels);
  };

  const handleLogin = async (p) => {
    if (p) {
      let auth = {
        email: email,
        password: password,
      };

      let data = await func(1, auth);

      if (data === null || data.code === 404 || data.code === 401) {
        let message = null;
        let closeParent = false;

        if (data === null) {
          closeParent = true;
          message = "No connection to backend";
        } else {
          message = data.message;
        }

        setMessage({
          header: "Error",
          message: message,
          autohide: true,
          delay: 3000,
          closeParent: closeParent,
          style: {
            backgroundcolor: "#FFCCCC",
            color: "black",
          },
        });

        setShowToast(true);
      } else if (data.code === 200) {
        setMessage({
          header: "Login succesfull",
          message: "Welcome ;)",
          autohide: true,
          delay: 2000,
          closeParent: true,
          style: {
            backgroundcolor: "#C5D4CD",
            color: "black",
          },
        });

        setShowToast(true);
      }
    } else {
      showDialog(false);
    }
  };

  const handleInvalid = (event) => {
    let message = "";
    if (!event.target.value) {
      message = "Email is required.";
    } else if (!event.target.value.includes("@")) {
      message = "Email must contain an @ symbol.";
    } else if (event.target.value.split("@")[1].split(".").length < 2) {
      message = "Please enter a valid email address.";
    }
    event.target.setCustomValidity(message);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} data-bs-theme="light">
        <Modal.Header
          closeButton
          onClick={() => {
            handleLogin(false);
          }}
        >
          <Modal.Title>{labels.title}</Modal.Title>
        </Modal.Header>

        {!showRegister && (
          <>
            <Form
              onSubmit={(event) => {
                event.preventDefault();
                handleLogin(true);
              }}
            >
              <Modal.Body>
                <>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder=""
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                    required
                    onInvalid={handleInvalid}
                  />
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder=""
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    required
                  />
                </>
              </Modal.Body>

              <Modal.Footer>
                <>
                  <Button
                    variant="outline-secondary"
                    className="mr-auto"
                    onClick={() => {
                      showRegisterForm(true);
                    }}
                  >
                    New user
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      handleLogin(false);
                    }}
                  >
                    {labels.btnClose}
                  </Button>
                  <Button type="submit" variant="primary">
                    Log in
                  </Button>
                </>
              </Modal.Footer>
            </Form>
          </>
        )}
        <RegisterForm
          show={showRegister}
          close={() => {
            logLabels();
            setShowRegister(false);
          }}
          func={func}
        />
        <ToastMsg
          show={showToast}
          close={() => {
            setShowToast(false);
            if (message.closeParent) showDialog(false);
          }}
          params={message}
        ></ToastMsg>
      </Modal>
    </>
  );
};
export default LoginDialog;

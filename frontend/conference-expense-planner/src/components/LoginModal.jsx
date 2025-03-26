import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const LoginModal = ({ show, handleClose }) => {
  const [showOtpField, setShowOtpField] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // **Request OTP from backend**
  const handleRequestOTP = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("OTP sent to your email.");
        setShowOtpField(true);
      } else {
        alert(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // **Handle Login (Password or OTP)**
  const handleLogin = async () => {
    try {
      setLoading(true);
      const endpoint = showOtpField
        ? "http://localhost:4000/api/auth/verify-otp"
        : "http://localhost:4000/api/auth/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(showOtpField ? { email, otp } : { email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role || "customer"); 

        window.location.href = data.role === "admin" ? "/admin" : "/products";
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Email Field */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          {/* Password Field (Hidden if using OTP) */}
          {!showOtpField && (
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          )}

          {/* OTP Field (Shown when "Login with OTP" is clicked) */}
          {showOtpField && (
            <Form.Group className="mb-3">
              <Form.Label>Enter OTP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </Form.Group>
          )}

          {/* OTP Request / Switch Login Mode */}
          {!showOtpField ? (
            <p
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={handleRequestOTP}
            >
              Login with OTP
            </p>
          ) : (
            <p
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => setShowOtpField(false)}
            >
              Login with Password
            </p>
          )}

          {/* Login Button */}
          <Button
            variant="primary"
            onClick={handleLogin}
            className="w-100"
            disabled={loading}
          >
            {loading ? "Processing..." : "Login"}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <p>
          Don't have an account?{" "}
          <a href="/signup" className="text-primary">
            Signup
          </a>
        </p>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;

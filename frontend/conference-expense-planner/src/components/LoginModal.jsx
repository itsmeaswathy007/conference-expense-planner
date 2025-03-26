import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const LoginModal = ({ show, handleClose }) => {
  const [isSignup, setIsSignup] = useState(false); // State to toggle between Login & Signup
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Data States (Common for Login & Signup)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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

  // **Handle Signup**
  const handleSignup = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phoneNumber, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful! You can now log in.");
        setIsSignup(false); // Switch back to login view
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isSignup ? "Sign Up" : "Login"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* ===== SIGNUP FORM ===== */}
          {isSignup ? (
            <>
              {/* Name Field */}
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Phone Number Field */}
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Email Field */}
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Password Field */}
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Signup Button */}
              <Button
                variant="success"
                className="w-100"
                onClick={handleSignup}
                disabled={loading}
              >
                {loading ? "Processing..." : "Sign Up"}
              </Button>
            </>
          ) : (
            // ===== LOGIN FORM =====
            <>
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
                className="w-100"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Processing..." : "Login"}
              </Button>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <p>
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => setIsSignup(false)}
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => setIsSignup(true)}
              >
                Sign up
              </span>
            </>
          )}
        </p>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;

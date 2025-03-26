const BASE_URL = "http://localhost:4000"; // Change this to your backend URL

// Login with OTP
export const loginWithOTP = async (email, otp) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    return await response.json();
  } catch (error) {
    console.error("Login with OTP failed:", error);
    return { success: false, message: "Server error" };
  }
};

// Login with Password
export const loginWithPassword = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return await response.json();
  } catch (error) {
    console.error("Login with Password failed:", error);
    return { success: false, message: "Server error" };
  }
};

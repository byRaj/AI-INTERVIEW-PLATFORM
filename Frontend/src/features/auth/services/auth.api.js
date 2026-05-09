import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// ✅ REGISTER
export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.log(err);

    throw err.response?.data || err;
  }
}

// ✅ VERIFY OTP
export async function verifyOtp({ userId, otp }) {
  try {
    const response = await api.post("/api/auth/verify-otp", {
      userId,
      otp,
    });

    return response.data;
  } catch (err) {
    console.log(err);

    throw err.response?.data || err;
  }
}

// ✅ RESEND OTP
export async function resendOtp({ email }) {
  try {
    const response = await api.post("/api/auth/resend-otp", {
      email,
    });

    return response.data;
  } catch (err) {
    console.log(err);

    throw err.response?.data || err;
  }
}

// ✅ LOGIN
export async function login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.log(err);

    throw err.response?.data || err;
  }
}

// ✅ LOGOUT
export async function logout() {
  try {
    const response = await api.get("/api/auth/logout");

    return response.data;
  } catch (err) {
    console.log(err);

    throw err.response?.data || err;
  }
}

// ✅ GET ME
export async function getMe() {
  try {
    const response = await api.get("/api/auth/get-me");

    return response.data;
  } catch (err) {
    console.log(err);

    throw err.response?.data || err;
  }
}

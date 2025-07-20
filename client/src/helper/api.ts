import axios from "axios";
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;

export async function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("Cannot find token");
  const decode = jwtDecode(token);
  return decode;
}

export async function authenticate(username: string) {
  try {
    return await axios.post("/api/authenticate", { username });
  } catch (error) {
    console.log("error fetching token");
    console.log(error);
    return { error };
  }
}

export async function getUser({ username }: { username: string }) {
  try {
    const { data } = await axios.get(`/api/user/${username}`);
    return { data };
  } catch (error) {
    console.log(error);
    return { error: "Username not found!" };
  }
}

export async function register(credentials: {
  username: string;
  email: string;
  password: string;
  profile?: string;
}) {
  try {
    const response = await axios.post("/api/register", credentials);

    const { username, email } = credentials;

    // SEND EMAIL
    if (response.status === 201 || response.status === 200) {
      await axios.post("/api/registerMail", {
        username: username,
        userEmail: email,
        text: response.data.message,
      });
    }

    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function verifyPassword({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    if (username) {
      const response = await axios.post("/api/login", { username, password });
      return Promise.resolve(response);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function updateUser(userData: {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
  profile: string;
}) {
  try {
    const token = localStorage.getItem("token");
    const data = await axios.put("/api/updateUser", userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function generateOTP(username: string) {
  try {
    const {
      data: { code },
      // data,
      status,
    } = await axios.get("/api/generateOTP", {
      params: { username },
    });

    if (status === 201) {
      const {
        data: { email },
      } = await getUser({ username });
      const text = `Your password reset OTP is ${code}. Verify and reset your password.`;
      await axios.post("/api/registerMail", {
        username,
        userEmail: email,
        text,
        subject: "Password Reset OTP",
      });
    }

    return Promise.resolve(code);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

export async function verifyOTP({
  username,
  code,
}: {
  username: string;
  code: string;
}) {
  try {
    const { data, status } = await axios.get("/api/verifyOTP", {
      params: { username, code },
    });
    return { data, status };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function resetPassword({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    const response = await axios.put("/api/resetPassword", {
      username,
      password,
    });
    return Promise.resolve(response);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

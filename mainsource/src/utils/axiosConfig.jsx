// import axios from "axios";
// import { API_URL } from "../config";

// // import Cookies from 'js-cookie';

// const axiosInstance = axios.create({
//   baseURL: API_URL || "http://localhost:3000/",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   auth: {
//     username: "admin",
//     password: "12345",
//   },
// });

// // axiosInstance.interceptors.request.use(
// //   (config) => {
// //     const token = Cookies.get('token'); // Corrected: Use Cookies.get() to retrieve token
// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`; // Attach token
// //     }
// //     return config;
// //   },
// //   (error) => {
// //     return Promise.reject(error);
// //   }
// // );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401 && !window.location.href.includes("/")) {
//       // Cookies.remove('token'); // Use js-cookie to remove token consistently
//       window.location.href = "/"; // Redirect to login
//     }
//     return Promise.reject(error.response?.data || "Request failed");
//   }
// );

// export default axiosInstance;



import axios from "axios";
import { API_URL } from "../config";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//  Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔄 Handle 401 - redirect to login if token expired
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_token_expires");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from "axios";

class Api {
  instance;
  constructor() {
    this.instance = axios.create({
      baseURL: "http://localhost:8080",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.response.use(
      (response) => {
        if (response.config.url === "login" || response.config.url === "social") {
          console.log("Response data:", response.data);
          sessionStorage.setItem("token", response.data.token);

          let redirectPath = "/"; // Default redirect path

          // Check the role and store accordingly
          if (response.data.role === "Job-seeker") {
            sessionStorage.setItem("roleJobSeeker", response.data.role);
          } else if (response.data.role === "Enterprise") {
            sessionStorage.setItem("roleEnterprise", response.data.role);
            redirectPath = "/Ehome"; // Set redirect path for Enterprise
          } else if (response.data.role === "Admin") {
            sessionStorage.setItem("roleAdmin", response.data.role);
          }

          // Redirect based on the role
          window.location.replace(redirectPath);
        }
        return response;
      },
      (error) => {
        if (error.response?.data?.message === "expired_session") {
          sessionStorage.removeItem("token");
          window.location.replace("login");
        }
        return Promise.reject(error);
      }
    );
  }
}

// https://topjobbackend-production.up.railway.app
const api = new Api().instance;
export default api;

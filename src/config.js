// src/config.js
// src/config.js
const config = {
  development: {
    API_URL: "http://localhost:5000/api",
  },
  production: {
    API_URL: "https://portfolio-backend-tfin.onrender.com", 
  },
};


export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
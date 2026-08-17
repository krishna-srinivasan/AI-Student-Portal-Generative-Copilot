// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://ai-student-portal-generative-copilot.onrender.com",
// });

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-student-portal-generative-copilot.onrender.com",
  timeout: 60000, // ⏳ 60-second timeout for mobile uploads & AI embedding
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
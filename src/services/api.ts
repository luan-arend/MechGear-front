import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepta as respostas para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Deixe o tratamento de erro para ser feito nos componentes
    return Promise.reject(error);
  }
);

export default api;

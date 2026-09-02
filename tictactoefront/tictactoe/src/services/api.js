import axios from "axios";

const api = axios.create({
  baseURL: " https://tictactoe-q6bb.onrender.com",
});

export default api;
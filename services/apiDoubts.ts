import axios from 'axios';

const apiDoubts = axios.create({
  baseURL: 'https://api-dentinho-feliz.onrender.com', // substitua se necessário
  headers: { 'Content-Type': 'application/json' },
});

export default apiDoubts;

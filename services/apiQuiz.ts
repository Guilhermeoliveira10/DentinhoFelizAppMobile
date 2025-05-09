import axios from 'axios';

const apiQuiz = axios.create({
  baseURL: 'https://api-quiz-6a27.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

export default apiQuiz;

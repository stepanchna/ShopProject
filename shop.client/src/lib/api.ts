import axios from 'axios';

export const api = axios.create({
  baseURL: '/api', // сервер отдаёт API из /api
});

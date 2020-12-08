import axios from 'axios';

const http = axios.create({});

http.interceptors.response.use((response) => {
  return response;
});

export default http;

import axios from 'axios';

const sameOriginApi = axios.create({
  withCredentials: true,
});

export default sameOriginApi;

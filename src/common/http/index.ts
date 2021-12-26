import axios from 'axios';

export const http = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    throw error;
  },
);

export function setHeaders(headers: any) {
  Object.assign(http.defaults.headers, headers);
}

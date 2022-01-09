import { HttpException } from '@nestjs/common';
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
    if (process.env.NODE_ENT !== 'production') throw new HttpException(error?.response?.data, error.response.status);

    throw error;
  },
);

export function setHeaders(headers: any) {
  Object.assign(http.defaults.headers, headers);
}

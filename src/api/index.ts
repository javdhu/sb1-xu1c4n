import axios from 'axios';
import { VFGData, InferenceRequest, LearnRequest } from '../types';

const axiosInstance = axios.create({
  baseURL: 'https://gpil-server.demo.dev.verses.build',
});

export const api = {
  getGraph: async () => {
    const response = await axiosInstance.get<VFGData>('/graph');
    return response.data;
  },

  setGraph: async (data: VFGData) => {
    await axiosInstance.post('/graph', data);
  },

  infer: async (request: InferenceRequest) => {
    const response = await axiosInstance.post('/infer', request);
    return response.data;
  },

  learn: async (request: LearnRequest) => {
    const response = await axiosInstance.post('/learn', request);
    return response.data;
  },
};
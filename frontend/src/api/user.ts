import axiosInstance from './axios';
import { User } from '../types';

export const fetchMe = async (): Promise<User> => {
    const { data } = await axiosInstance.get<{ success: true; data: User }>('/user/me');
    return data.data;
};

import axiosInstance from './axios';
import { AuthResponse, LoginPayload, RegisterPayload } from '../types';

export const registerApi = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<{ success: true; data: AuthResponse }>(
        '/auth/register',
        payload
    );
    return data.data;
};

export const loginApi = async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<{ success: true; data: AuthResponse }>(
        '/auth/login',
        payload
    );
    return data.data;
};

export const logoutApi = async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
};

export const refreshApi = async (refreshToken: string): Promise<string> => {
    const { data } = await axiosInstance.post<{ success: true; data: { accessToken: string } }>(
        '/auth/refresh',
        { refreshToken }
    );
    return data.data.accessToken;
};

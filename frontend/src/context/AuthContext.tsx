import React, {
    createContext,
    useCallback,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import { User, LoginPayload, RegisterPayload } from '../types';
import { loginApi, registerApi, logoutApi } from '../api/auth';
import { fetchMe } from '../api/user';
import {
    setAccessToken,
    setRefreshToken,
    clearTokens,
    getAccessToken,
} from '../api/axios';

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    updateBalance: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export { AuthContext };

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session on mount
    useEffect(() => {
        const restoreSession = async () => {
            const token = getAccessToken();
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const me = await fetchMe();
                setUser(me);
            } catch {
                clearTokens();
            } finally {
                setIsLoading(false);
            }
        };
        restoreSession();
    }, []);

    const login = useCallback(async (payload: LoginPayload): Promise<void> => {
        const response = await loginApi(payload);
        setAccessToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        setUser(response.user);
    }, []);

    const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
        const response = await registerApi(payload);
        setAccessToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        setUser(response.user);
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        try {
            await logoutApi();
        } catch {
            // Ignore errors; clear tokens regardless
        } finally {
            clearTokens();
            setUser(null);
        }
    }, []);

    const refreshUser = useCallback(async (): Promise<void> => {
        const me = await fetchMe();
        setUser(me);
    }, []);

    const updateBalance = useCallback((newBalance: number): void => {
        setUser((prev) => (prev ? { ...prev, balance: newBalance } : prev));
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refreshUser,
                updateBalance,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

import jwt from 'jsonwebtoken';

interface RefreshTokenPayload {
    userId: string;
}

const generateRefreshToken = (payload: RefreshTokenPayload): string => {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) throw new Error('REFRESH_TOKEN_SECRET is not defined');

    return jwt.sign(payload, secret, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
    } as jwt.SignOptions);
};

export default generateRefreshToken;

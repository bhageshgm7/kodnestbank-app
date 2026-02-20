import jwt from 'jsonwebtoken';

interface AccessTokenPayload {
    userId: string;
    email: string;
    accountNumber: string;
}

const generateAccessToken = (payload: AccessTokenPayload): string => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) throw new Error('ACCESS_TOKEN_SECRET is not defined');

    return jwt.sign(payload, secret, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
    } as jwt.SignOptions);
};

export default generateAccessToken;

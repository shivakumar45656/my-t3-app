import jwt from 'jsonwebtoken';

// Define secret keys f(or signing the tokens
const TokenSecret = process.env.jwt_secret_key ? process.env.jwt_secret_key : 'Ab123qwerty';

// Define a payload interface for the tokens (you can include any user data you want)
interface TokenPayload {
    userId: number;
    email: string;
    // You can include additional data as needed
}

// Define options for the tokens (optional)
const accessTokenOptions: jwt.SignOptions = {
    expiresIn: '15m', // Access token expires in 15 minutes
    // You can include additional options as needed
};

const refreshTokenOptions: jwt.SignOptions = {
    expiresIn: '7d', // Refresh token expires in 7 days
    // You can include additional options as needed
};

// Function to generate an access token
export function generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, TokenSecret, accessTokenOptions);
}

// Function to generate a refresh token
export function generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, TokenSecret, refreshTokenOptions);
}

// Function to generate a new access token from a refresh token
export function generateAccessTokenFromRefreshToken(refreshToken: string): string | null {
    try {
        const decoded = jwt.verify(refreshToken, TokenSecret) as TokenPayload;
        const newAccessToken = generateAccessToken(decoded);
        return newAccessToken;
    } catch (error) {
        console.error('Error generating access token from refresh token:', error);
        return null;
    }
}

export function decodeJWT(token: string, options?: jwt.VerifyOptions): TokenPayload | null {
    try {
      const decodedToken = jwt.verify(token, TokenSecret) as TokenPayload;
      return decodedToken;
    } catch (error:any) {
      if (error instanceof jwt.TokenExpiredError) {
        console.error('JWT token has expired');
      } else {
        console.error('Error decoding JWT:', error.message);
      }
      return null;
    }
  }

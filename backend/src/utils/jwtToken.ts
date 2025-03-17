import jwt from "jsonwebtoken";
import { IUser } from "../model/user.model";

// Define the return type for generateTokens
interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Function to generate access and refresh tokens
export const generateTokens = (user: IUser): TokenPair => {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("JWT secrets are not defined in environment variables.");
  }

  const accessToken = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET, 
    { expiresIn: "7d" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET, 
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// Function to decode and verify a JWT token
export const decodeToken = (token: string): string | null => {
  try {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("JWT secret is not defined in environment variables.");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    console.error("Invalid token:", error);
    return null; // Return null instead of throwing an error for better handling
  }
};

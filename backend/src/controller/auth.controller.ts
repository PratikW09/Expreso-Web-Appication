import { Request, Response } from "express";
import User, { IUser } from "../model/user.model";
import { generateTokens } from "../utils/jwtToken";
import { successResponse, errorResponse } from "../utils/responseHandler";

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const { username, email, password, fullName, contact } = req.body;

  // ✅ Validate Input
  if (!username || !email || !password || !fullName || !contact) {
    return res.status(400).json(errorResponse("Please fill in all fields"));
  }

  try {
    // ✅ Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json(errorResponse("Email or username already exists"));
    }

   
    

    // ✅ Create a new user instance
    const newUser = new User({ username, email,password, fullName, contact });

    // ✅ Generate Access & Refresh Tokens
    const { accessToken, refreshToken } = generateTokens(newUser);

    // ✅ Store refresh token in the database
    newUser.refreshToken = refreshToken;

    // ✅ Save the new user to the database
    await newUser.save();

    // ✅ Cookie options (secure & httpOnly)
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production only
    };

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(successResponse("User registered successfully", { user: newUser, accessToken, refreshToken }));

  } catch (error: any) {
    console.error("Error registering user:", error.message);
    return res.status(500).json(errorResponse("Server error", error.message));
  }
};

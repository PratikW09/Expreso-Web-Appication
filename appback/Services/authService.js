import User from '../Models/usermodels.js';
import { hashPassword, generateTokens } from '../Utils/authutils.js';
import bcrypt from 'bcrypt';

export const registerUserService = async (userData) => {
  const { username, email, password, fullName, contact } = userData;

  
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    const error = new Error('Email or username already exists');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    fullName,
    contact,
  });

  const { accessToken, refreshToken } = await generateTokens(newUser);

  newUser.refreshToken = refreshToken;
  await newUser.save();

  return {
    userId: newUser._id,
    username: newUser.username,
    email: newUser.email,
    accessToken,
    refreshToken,
  };
};

export const loginUserService = async (emailOrUsername, password)=>{
    const user = await User.findOne({$or : [{email:emailOrUsername},{username:emailOrUsername}]});

    if(!user){
        const error = new Error('Invalid email/username.');
        error.statusCode = 400;
        throw error;
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        const error = new Error('Invalid password.');
        error.statusCode = 400;
        throw error;
    }

    const { accessToken, refreshToken } = generateTokens(user);

    user.refreshToken = refreshToken;
  await user.save();

  // Return necessary data
  return {
    user,
    accessToken,
    refreshToken,
  };
}

export const logoutUserService = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  // Check if the user exists
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
};
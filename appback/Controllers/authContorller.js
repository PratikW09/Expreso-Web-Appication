import User from '../Models/usermodels.js';
import {  decodeToken } from '../Utils/authutils.js';
import { registerUserService,loginUserService,logoutUserService } from '../Services/authService.js';
import { Response, errorResponse } from '../Utils/responseHandler.js';


export const registerUser = async (req, res, next) => {
  try {
    const userData = req.body;

    // Validate Input
    if (!userData.username || !userData.email || !userData.password || !userData.fullName || !userData.contact) {
      return errorResponse(res, 400, 'Please fill in all fields');
    }

    const newUser = await registerUserService(userData);

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .cookie('accessToken', newUser.accessToken, options)
      .cookie('refreshToken', newUser.refreshToken, options);

    return Response(res,201, 'User registered successfully', {
      userId: newUser.userId,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async(req,res,next)=>{
  try {
    
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return errorResponse(res, 400, 'Please fill in all fields');
    }

    const { user, accessToken, refreshToken } = await loginUserService(emailOrUsername, password);

    const options = {
      httpOnly: true,
      secure: true, // Use secure cookies in production (HTTPS)
      sameSite: 'strict', // Prevent CSRF attacks
    };

    res
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options);

    // Send success response
    return Response(res,200, 'Login successful', {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

export const getUserDetails = async(req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'No token provided user is not login' });
    }

    const userId = await decodeToken(token);
    // console.log(userId)
    
    // Assuming you have a User model
    const user = await User.findById({_id:userId}).select('-password'); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: 'User not found something went wrong ' });
    }
    // console.log(user)
    res.status(200).json({ message:"details feteched succuessfully" ,user });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



export const logoutUser = async (req, res, next) => {
  try {
  
    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

  // Check if token is provided
  if (!accessToken) {
    return errorResponse(res, 400, 'Token not found.');
  }

    const id = await decodeToken(accessToken);
    await logoutUserService(id);

    const options = {
      httpOnly: true,
      secure: true, 
      sameSite: 'strict',
    };

    res
      .clearCookie('accessToken', options)
      .clearCookie('refreshToken', options);

    // Send success response
    return Response(res,200, 'User logged out successfully');
  } catch (error) {
    next(error);
  }
};

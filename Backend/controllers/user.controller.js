import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({
        message: 'Something is missing!',
        success: false,
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'password do not match!',
        success: false,
      });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        message: 'User already exist!',
        success: false,
      });
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    await User.create({
      fullName,
      username,
      profilePhoto: gender === 'male' ? maleProfilePhoto : femaleProfilePhoto,
      password: hashPassword,
      gender,
    });

    return res.status(200).json({
      message: `Welcome to BakBak ${fullName}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server error',
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: 'Somthing is missing!',
        success: false,
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        message: 'Incorrect username!',
        success: false,
      });
    }

    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: 'Incorrect Password!',
        success: false,
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1d',
    });

    return res
      .status(201)
      .cookie('token', token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
      })
      .json({
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        profilePhoto: user.profilePhoto,
        message: 'Login Suggessfully',
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'server error',
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie('token', '', { maxAge: 0 }).json({
      message: 'Logout Successfully',
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server error',
      success: false,
    });
  }
};

export const getOtherUsers = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
      '-password'
    );
    if (!otherUsers) {
      return res.status(400).json({
        message: 'users not found',
        success: false,
      });
    }
    return res.status(200).json({
      otherUsers,
      message: 'all users',
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server error',
      success: false,
    });
  }
};

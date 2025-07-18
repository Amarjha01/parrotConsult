import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";

const genrateAccessTokenAndRefreshToken = async (userId) => {
  console.log('user id' , userId);
  
  try {
    const user = await User.findById(userId);
    console.log(user);
    
    if (!user) {
  throw new ApiError(404, 'User not found');
}

// ⚠️ Use environment variables for secrets
const accessToken = jwt.sign(
  {
    _id: user._id,
    role: user.role,
    phone: user.phone,
  },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: '7d' }
);

const refreshToken = jwt.sign(
  {
    _id: user._id,
  },
  process.env.REFRESH_TOKEN_SECRET,
  { expiresIn: '7d' }
);

user.refreshToken = refreshToken;
await user.save({ validateBeforeSave: false });

return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(
      500,
      "Failed to generate access token and refresh token"
    );
  }
};

export default genrateAccessTokenAndRefreshToken
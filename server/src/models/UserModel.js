import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
     
//     },
   
//     phoneNumber: {
//       type: Number,
//       required: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       enum: ["user", "admin", "consultant"],
//       default: "user",
//     },
//     refreshToken:{
//       type: String
//     },
    
//   },
//   {
//     timestamps: true,
//   }
// );

// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// userSchema.methods.comparePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

// userSchema.methods.genrateAccessToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//       name: this.name,
//       email: this.email,
//       role: this.role,
//       phoneNumber: this.phoneNumber,
//     },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" }
//   );
// };

// userSchema.methods.genrateRefreshToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//     },
//     process.env.REFRESH_TOKEN_SECRET,
//     { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
//   );
// };

// export const User = mongoose.model("User", userSchema);


const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  password: { type: String, required: true },

  // Optional and updatable later
  email: { type: String, unique: true, sparse: true },
  profileImage: { type: String, default: '' },

  role: { type: String, enum: ['user', 'consultant', 'admin'], default: 'user' },
 
  
  
  bio:{type : String},
  location:String,

 aadharVerified : {type:Boolean , default:false},
  kycVerify:{
    aadharNumber:Number,
    panNumber:String,
  },

  consultantRequest: { 
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: null },
    documents: {
      resume: String
    },
    consultantProfile: {
    sessionFee: Number,
    daysPerWeek: String,
    qualification: String,
    fieldOfStudy: String,
    university: String,
    graduationYear: Number,
    shortBio: String,
    languages: [String],
    yearsOfExperience: Number,
    category: String
  },
    requestedAt: { type: Date, default: Date.now },
    reviewedAt: Date
  },
  createdAt: { type: Date, default: Date.now }
});


export const User = mongoose.model('user' , userSchema)
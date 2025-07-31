import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  profileImage: { type: String, default: '' },
  role: { type: String, enum: ['user', 'consultant', 'admin'], default: 'user' },
  location:String,
  videoFreeTrial:{type:Boolean , default:false},
  chatFreeTrial:{type:Boolean , default:false},
  suspended:{type:Boolean , default:false},
  aadharVerified : {type:Boolean , default:false},

  kycVerify:{
    aadharNumber:Number,
    aadharURL:String,
    panNumber:String,
    panURL:String,
    createdAt: { type: Date, default: Date.now }
  },

  consultantRequest: { 
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: null },
    documents: {
      resume: String,
      other:[
        {
        documentName:String,
        documentType:String,
        DocumentURL:String,
        createdAt: { type: Date, default: Date.now }
      }
      ]
    },
    consultantProfile: {
    sessionFee: Number,
    daysPerWeek: String,
    days:[String],
    availableTimePerDay: String,
    qualification: String,
    fieldOfStudy: String,
    university: String,
    graduationYear: Number,
    keySkills: [String],
    Specialized:[String],
    shortBio: String,
    languages: [String],
    yearsOfExperience: Number,
    category: String,
    profileHealth:Number,
    wallet:{type:Number , default: 0},
    withdrawelHistory:[]
  },
    requestedAt: { type: Date, default: Date.now },
    reviewedAt: Date
  },
  createdAt: { type: Date, default: Date.now }
});


export const User = mongoose.model('user' , userSchema)
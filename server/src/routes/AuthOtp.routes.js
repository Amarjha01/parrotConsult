import express from "express";

const router = express.Router();


import {Router} from 'express';
import { sendOtpSms, verifyOtpSms } from "../controllers/OtpController.js";

const otpRoutes = Router()

otpRoutes.post('/send-otp' , sendOtpSms )
otpRoutes.post('/verify-otp' , verifyOtpSms )






export default otpRoutes;

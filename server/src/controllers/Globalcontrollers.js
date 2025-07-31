import {User} from "../models/UserModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/Apiresponse.js";

export const seeallactiveconsultants = asyncHandler(async (req, res) => {
    const consultants = await User.find({ role : 'consultant' });
    return res.status(200).json(new ApiResponse(200, consultants));
 
    
});



export const viewSingleConsultant = asyncHandler(async (req , res) =>{
   
    const {id} = req.body
    
    const consultant = await User.findById(id)
    return res.status(200).json(new ApiResponse(200 , consultant))
})
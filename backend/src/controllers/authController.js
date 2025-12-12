import { asyncHandler } from "../middlewares/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export  const registerUser=  asyncHandler(async(req,res)=>{




res.status(201).json(new ApiResponse(201,"User registered successfully"));


})
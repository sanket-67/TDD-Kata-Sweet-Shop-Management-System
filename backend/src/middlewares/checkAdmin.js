import ApiError from "../utils/ApiError.js";

const checkAdmin = (req, res, next) => {
   
    
    if (!req.user || req.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admin only.");
    }

    next();
};

export default checkAdmin;

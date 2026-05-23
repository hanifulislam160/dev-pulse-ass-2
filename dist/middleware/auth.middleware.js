import jwt from "jsonwebtoken";
// Verify JWT Middleware
export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};
// Role Authorization Middleware
export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        // Check role
        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden access",
            });
        }
        next();
    };
};
//# sourceMappingURL=auth.middleware.js.map
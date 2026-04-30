import httpStatus from "http-status";
import { verifyToken } from "../utils/token.js";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Authorization token missing",
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  req.user = decoded;
  next();
}

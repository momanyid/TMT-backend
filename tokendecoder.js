const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token" });
    }

    // Attach to request object
    req.user = {
      id: decoded.id,   // ✅ matches what you signed
      role: decoded.role, // ✅ now role is available
    };

    next();
  } catch (error) {
    console.error("Error in verifyToken ", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};
const jwt = require("jsonwebtoken");

const authUserMiddleware = (req, res, next) => {
  try {
    // const token = req.cookies.token;

    // if (!token) {
    //   return res.status(401).json({
    //     message: "Unauthorized: No token provided",
    //   });
    // }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Access deined, No token provided." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token formate",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = { authUserMiddleware };

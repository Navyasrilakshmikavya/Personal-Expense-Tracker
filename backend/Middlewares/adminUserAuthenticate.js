const jwt = require("jsonwebtoken");
const User = require("../Models/User"); 

const adminUserAuthenticate = async (req, res, next) => {
  console.log("token from admin user",req.header("Authorization"))
  try {
    const token = req.header("Authorization");
    console.log("token from admin user",token)
    if (!token) {
      console.log("aunthenticate",token)
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token.replace("Bearer ",""), process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = adminUserAuthenticate ;  // Ensure it's exported properly
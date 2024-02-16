const jwt = require("jsonwebtoken");

const requireAuth = async(req, res, next) => {
  // verify authorization header
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  // verify token
  const token = authorization.replace("Bearer ", "");   // remove "Bearer " from token
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ _id }).select('_id');
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Request is unauthorized" });
  }
};

const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, "secretcode");
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });
    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    
    next();
  } catch (e) {
    res.status(400).send({ error: "PLZ Authenticate" });
  }
};
module.exports = auth;

const jwt = require("jsonwebtoken");
const Users = require("../service/schemas/users");

const authenticateToken = async (request, response, next) => {
  const authHeader = request.headers.authorization;
  // const token = authHeader && authHeader.split(" ")[1];
  const token = authHeader.split(" ")[1];

  if (!token) {
    return response.status(401).json({ message: `Not authorized` });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log(decoded);
  } catch (error) {
    console.error("Error during authentification: ", error);
    next();
  }
};

module.exports = authenticateToken;

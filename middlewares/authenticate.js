const jwt = require("jsonwebtoken");
const Users = require("../service/schemas/users");

const authenticateToken = async (request, response, next) => {
  const authHeader = request.headers["authorization"];
  console.log(authHeader);
};

module.exports = authenticateToken;

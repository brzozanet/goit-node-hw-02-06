const userLoggedIn = async (request, response, next) => {
  try {
    const user = request.user;

    if (user.token === null) {
      return response.status(401).json({ message: `Not authorized` });
    }

    next();
  } catch (error) {
    console.error("Something went wrong: ", error);
  }
};

module.exports = userLoggedIn;

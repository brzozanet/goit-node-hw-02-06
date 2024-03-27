const express = require("express");
const router = express.Router();

const joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = joi.extend(joiPasswordExtendCore);

const { addUser } = require("../../service/index");

const userSchema = joi.object({
  email: joi.string().email().required(),
  password: joiPassword
    .string()
    .min(8)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .doesNotInclude(["password", "12345678", "qwertyui"])
    .required(),
});

router.post("/signup", async (request, response, next) => {
  try {
    const body = request.body;
    const { error } = userSchema.validate(body);

    console.log(error);

    if (error) {
      const validatingErrorMessage = error.details[0].message;
      return response
        .status(400)
        .json({ message: `${validatingErrorMessage}` });
    }

    const addedUser = await addUser(body);
    response.json(addedUser);
    console.log("User signup successfully");
  } catch (error) {
    console.error("Error during signup: ", error);
    next();
  }
});

module.exports = router;

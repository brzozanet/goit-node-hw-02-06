const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = joi.extend(joiPasswordExtendCore);

const Users = require("../../service/schemas/users");
const { addUser } = require("../../service/index");

const userSchema = joi.object({
  email: joi.string().email().required(),
  password: joiPassword
    .string()
    .min(8)
    // .minOfSpecialCharacters(1)
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
    const existingUser = await Users.findOne({ email: body.email });

    if (existingUser) {
      return response
        .status(409)
        .json({ message: `Email ${body.email} is already in use` });
    }

    if (error) {
      const validatingErrorMessage = error.details[0].message;
      return response
        .status(400)
        .json({ message: `${validatingErrorMessage}` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const addedUser = await addUser({
      email: body.email,
      password: hashedPassword,
    });
    response.json(addedUser);
    console.log("User signup successfully");
  } catch (error) {
    console.error("Error during signup: ", error);
    next();
  }
});

router.post("/login", async (request, response, next) => {
  try {
    const body = request.body;
    const { error } = userSchema.validate(body);
    const existingUser = await Users.findOne({ email: body.email });

    if (error) {
      const validatingErrorMessage = error.details[0].message;
      return response
        .status(400)
        .json({ message: `${validatingErrorMessage}` });
    }

    if (!existingUser) {
      return response
        .status(401)
        .json({ message: `Email or password is wrong` });
    }

    const validPassword = await bcrypt.compare(
      body.password,
      existingUser.password
    );

    if (!validPassword) {
      return response
        .status(401)
        .json({ message: `Email or password is wrong` });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    existingUser.token = token;
    await existingUser.save();

    response.json({
      token: `${existingUser.token}`,
      user: {
        email: `${existingUser.email}`,
        subscription: `${existingUser.subscription}`,
      },
    });
    console.log("User login successfully");
  } catch (error) {
    console.error("Error during login: ", error);
    next();
  }
});

router.get("/logout", async (request, response, next) => {
  try {
    // const loggedUser
  } catch (error) {
    console.error("Error during logout: ", error);
    next();
  }
});

module.exports = router;

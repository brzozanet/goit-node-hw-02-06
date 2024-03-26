const express = require("express");
const Joi = require("joi");
const router = express.Router();

const { addUser } = require("../../service/index");

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post("/signup", async (req, res, next) => {
  try {
    const body = req.body;
    const { error } = userSchema.validate(body);

    if (error) {
      const validatingErrorMessage = error.details[0].message;
      return res.status(400).json({ message: `${validatingErrorMessage}` });
    }

    const newUser = await addUser(body);
    res.status(200).json(newUser);
    console.log("User created successfully");
  } catch (error) {
    console.error("Error reading contacts file: ", error);
    next(error);
  }
});

module.exports = router;

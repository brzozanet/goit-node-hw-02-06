const request = require("supertest");
const express = require("express");
// const Users = require("../models/Users"); // ścieżka do modelu użytkownika
// const router = require("../routes/users"); // ścieżka do routera użytkownika
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { addUser } = require("../../service/index");

jest.useFakeTimers();

const app = express();
app.use(express.json());

describe("POST /login", () => {
  let user;
  let hashedPassword;
  let token;

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash("password123", 10);
    token = jwt.sign(
      { id: new mongoose.Types.ObjectId() },
      // process.env.JWT_SECRET,
      "SECRET",
      { expiresIn: "1y" }
    );

    user = addUser({
      email: "test@example.com",
      password: hashedPassword,
      verify: true,
      token: token,
    });

    await user.save();
  });

  beforeEach(() => jest.useFakeTimers());

  it("should login a user with valid credentials", async () => {
    const res = await request(app)
      .post("/login")

      .set("Content-Type", /json/)
      .set("Authorization", "bearer " + token)

      .send({
        email: "test@example.com",
        password: "password123",
      });

    jest.runAllTimers();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  afterAll(async () => {
    await Users.deleteOne({ email: "test@example.com" });
  });
});

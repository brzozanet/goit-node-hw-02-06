const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const router = express.Router();
const contactsPath = path.resolve("./models/contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(data);
  console.log("listContacts: contacts downloaded successfully");
  return contacts;
};

router.get("/", async (request, response, next) => {
  try {
    const contacts = await listContacts();
    response.json(contacts);
    console.log("GET: contacts downloaded successfully");
  } catch (error) {
    console.error("Error reading contacts file: ", error);
    next(error);
  }
});

router.get("/:contactId", async (request, response, next) => {
  response.json({ message: "template message" });
});

router.post("/", async (request, response, next) => {
  response.json({ message: "template message" });
});

router.delete("/:contactId", async (request, response, next) => {
  response.json({ message: "template message" });
});

router.put("/:contactId", async (request, response, next) => {
  response.json({ message: "template message" });
});

module.exports = router;

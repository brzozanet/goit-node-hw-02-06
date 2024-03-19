const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const nanoid = require("nanoid-esm");

const router = express.Router();

const contactsPath = path.resolve("./models/contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(data);
  return contacts;
};

const getById = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(data);

  const contact = contacts.find((contact) => contact.id === contactId);

  return contact;
};

// addContact(body);

router.get("/", async (request, response, next) => {
  try {
    const contacts = await listContacts();
    response.json(contacts);
    console.log("All contacts downloaded successfully");
  } catch (error) {
    console.error("Error reading contacts file: ", error);
    next(error);
  }
});

router.get("/:contactId", async (request, response, next) => {
  try {
    const contactId = request.params.contactId;
    const contact = await getById(contactId);

    if (contact) {
      response.json(contact);
      console.log("Selected contact downloaded successfully");
    } else {
      next();
      console.log("Contact not found");
    }
  } catch (error) {
    console.error("Error reading contacts file: ", error);
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
});

router.delete("/:contactId", async (request, response, next) => {
  response.json({ message: "template message" });
});

router.put("/:contactId", async (request, response, next) => {
  response.json({ message: "template message" });
});

module.exports = router;

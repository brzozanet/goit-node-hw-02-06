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
// removeContact(id);

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
  console.log(request.body);
  const { name, email, phone } = request.body;

  if (!name || !email || !phone) {
    return response
      .status(400)
      .json({ message: "missing required name - field" });
  } else {
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return response.json(contacts);
  }
});

router.delete("/:contactId", async (request, response, next) => {
  const contactId = request.params.contactId;

  const data = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(data);

  if (contacts.find((contact) => contact.id === contactId)) {
    const newContacts = contacts.filter((contact) => contact.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
    return response.status(200).json({ message: "contact deleted" });
  } else {
    next();
  }
});

router.put("/:contactId", async (request, response, next) => {
  response.json({ message: "template message" });
});

module.exports = router;

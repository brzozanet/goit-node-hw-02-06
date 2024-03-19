const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const nanoid = require("nanoid");

console.log(nanoid());

const router = express.Router();
const contactsPath = path.resolve("./models/contacts.json");

const getContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(data);
  return contacts;
};

// NOTE: why a new getContactById fn?
// const getContactById = async () => {}

router.get("/", async (request, response, next) => {
  try {
    const contacts = await getContacts();
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
    const contacts = await getContacts();
    const selectedContact = contacts.find(
      (contact) => contact.id === contactId
    );

    if (selectedContact) {
      response.json(selectedContact);
      console.log("Selected contact downloaded successfully");
    } else {
      // NOTE: can I not repeat the code? DRY -> app.js L:18
      response.status(404).json({ message: "Not found" });
      console.log("Contact not found");
    }
  } catch (error) {
    console.error("Error reading contacts file: ", error);
    next(error);
  }
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

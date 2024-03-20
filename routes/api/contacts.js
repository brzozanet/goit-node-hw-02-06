const express = require("express");
const router = express.Router();

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts.js");

router.get("/", async (request, response, next) => {
  try {
    const contactsList = await listContacts();
    response.json(contactsList);
    console.log("All contacts downloaded successfully");
  } catch (error) {
    console.error("Error reading contacts file: ", error);
    next(error);
  }
});

router.get("/:contactId", async (request, response, next) => {
  try {
    const contactId = request.params.contactId;
    const selectedContact = await getContactById(contactId);

    if (selectedContact) {
      response.json(selectedContact);
      console.log("Selected contact downloaded successfully");
    } else {
      console.log("Contact not found");
      next();
    }
  } catch (error) {
    console.error("Error reading contacts file: ", error);
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const body = request.body;
    const addedContact = await addContact(body);

    if (!body.name || !body.email || !body.phone) {
      return response
        .status(400)
        .json({ message: "missing required field(s)" });
    } else {
      return response.json(addedContact);
    }
  } catch (error) {
    console.error("Error during add contact: ", error);
    next(error);
  }
});

router.delete("/:contactId", async (request, response, next) => {
  try {
    const contactId = request.params.contactId;
    const deletedContact = await removeContact(contactId);

    if (deletedContact) {
      return response.status(200).json({ message: "contact deleted" });
    } else {
      console.log("Contact not found");
      next();
    }
  } catch (error) {
    console.error("Error during delete contact: ", error);
    next(error); // NOTE: why not { message: "Not found" }?
  }
});

router.put("/:contactId", async (request, response, next) => {
  const contactId = request.params.contactId;
  const body = request.body;
  const updatedContact = await updateContact(contactId, body);

  if (Object.keys(body).length === 0) {
    return response.status(400).json({ message: "missing fields" });
  } else {
    return response
      .status(200)
      .json(updatedContact.find((contact) => contact.id === contactId));
  }
});

module.exports = router;

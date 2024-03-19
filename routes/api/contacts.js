const express = require("express");
const router = express.Router();

const listContacts = require("../../models/contacts.js");

router.get("/", async (request, response, next) => {
  try {
    const contactsList = await listContacts(); // NOTE: WTF?
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
    const selectedContact = await getContactById(contactId); // NOTE: WTF?

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
  try {
    const contactId = request.params.contactId;
    const deletedContact = await removeContact(contactId); // NOTE: WTF?

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
  const {
    params: { contactId },
    body,
  } = request;

  console.log(body);

  if (Object.keys(body).length === 0) {
    return response.status(400).json({ message: "missing fields" });
  } else {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const newContacts = contacts.map((contact) =>
      contact.id === contactId ? { ...contact, ...body } : contact
    );
    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
    return response
      .status(200)
      .json(newContacts.find((contact) => contact.id === contactId));
  }
});

module.exports = router;

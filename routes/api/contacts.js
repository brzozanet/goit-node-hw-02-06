const express = require("express");
const Joi = require("joi");
const router = express.Router();

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts.js");

const userPatternPOST = Joi.object({
  name: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(9).required(),
});

const userPatternPUT = Joi.object({
  name: Joi.string().min(5),
  email: Joi.string().email(),
  phone: Joi.string().min(9),
});

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

// NOTE: basic validation
// router.post("/", async (request, response, next) => {
//   try {
//     const body = request.body;
//     const addedContact = await addContact(body);

//     if (!body.name || !body.email || !body.phone) {
//       return response
//         .status(400)
//         .json({ message: "missing required field(s)" });
//     } else {
//       return response.json(addedContact);
//     }
//   } catch (error) {
//     console.error("Error during add contact: ", error);
//     next(error);
//   }
// });

// NOTE: joi validation
router.post("/", async (request, response, next) => {
  try {
    const body = request.body;
    const { error } = userPatternPOST.validate(body);

    if (error) {
      const validatingErrorMessage = error.details[0].message;
      return response
        .status(400)
        .json({ message: `${validatingErrorMessage}` });
    }

    const addedContact = await addContact(body);
    response.json(addedContact);
    console.log("Contact added successfully");
  } catch (error) {
    console.error("Error during adding contact: ", error);
    next(error);
  }
});

router.delete("/:contactId", async (request, response, next) => {
  try {
    const contactId = request.params.contactId;
    const deletedContact = await removeContact(contactId);

    if (deletedContact) {
      response.status(200).json({ message: "contact deleted" });
      console.log("Contact deleted successfully");
    } else {
      console.log("Contact not found");
      next();
    }
  } catch (error) {
    console.error("Error during delete contact: ", error);
    next(error); // NOTE: why not { message: "Not found" }?
  }
});

// NOTE: basic validation
// router.put("/:contactId", async (request, response, next) => {
//   try {
//     const body = request.body;
//     const contactId = request.params.contactId;
//     const updatedContact = await updateContact(contactId, body);

//     if (Object.keys(body).length === 0) {
//       return response.status(400).json({ message: "missing fields" });
//     } else {
//       return response
//         .status(200)
//         .json(updatedContact.find((contact) => contact.id === contactId));
//     }
//   } catch (error) {
//     console.error("Error during editing contact: ", error);
//     next(error);
//   }
// });

// NOTE: joi validation
router.put("/:contactId", async (request, response, next) => {
  try {
    const body = request.body;
    const { error } = userPatternPUT.validate(body);

    if (error) {
      const validatingErrorMessage = error.details[0].message;
      return response
        .status(400)
        .json({ message: `${validatingErrorMessage}` });
    }

    const contactId = request.params.contactId;
    const updatedContact = await updateContact(contactId, body);
    response
      .status(200)
      .json(updatedContact.find((contact) => contact.id === contactId));
    console.log("Contact edited successfully");
  } catch (error) {
    console.error("Error during editing contact: ", error);
    next(error);
  }
});

module.exports = router;

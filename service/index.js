const Contact = require("./schemas/contacts");
const User = require("./schemas/users");

const listContacts = async () => Contact.find();

const getContactById = async (contactId) => Contact.findOne({ _id: contactId });

const addContact = async (contact) => Contact.create(contact);

const removeContact = async (contactId) =>
  Contact.findOneAndDelete({ _id: contactId });

const updateContact = async (contactId, body) =>
  Contact.findByIdAndUpdate({ _id: contactId }, body, { new: true });

const updateStatusContact = async (contactId, body) =>
  Contact.findByIdAndUpdate({ _id: contactId }, body, { new: !true });

const addUser = async (body) => User.create(body);

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
  addUser,
};

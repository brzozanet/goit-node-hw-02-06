const Contact = require("./schemas/contacts");
const Users = require("./schemas/users");

const listContacts = async (userId) => {
  return Contact.find({ owner: userId });
};

const getContactById = async (contactId) => {
  return Contact.findOne({ _id: contactId });
};

const addContact = async (contact) => {
  return Contact.create(contact);
};

const removeContact = async (contactId) => {
  return Contact.findOneAndDelete({ _id: contactId });
};

const updateContact = async (contactId, body) => {
  return Contact.findByIdAndUpdate({ _id: contactId }, body, { new: true });
};

const updateStatusContact = async (contactId, body) => {
  return Contact.findByIdAndUpdate({ _id: contactId }, body, { new: true });
};

const addUser = async (user) => {
  return Users.create(user);
};

const loginUser = async (user) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
  addUser,
  loginUser,
};

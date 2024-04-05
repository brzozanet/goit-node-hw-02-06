const fs = require("fs");
const path = require("path");

const Contact = require("./schemas/contacts");
const Users = require("./schemas/users");

const listContacts = async (userId) => {
  return Contact.find({ owner: userId });
};

const getContactById = async (userId, contactId) => {
  return Contact.findOne({ owner: userId, _id: contactId });
};

const addContact = async (userId, contact) => {
  return Contact.create({ ...contact, owner: userId });
};

const removeContact = async (userId, contactId) => {
  // return Contact.findOneAndDelete({ owner: userId, _id: contactId });
  return await Contact.findOneAndDelete({
    owner: userId,
    _id: contactId,
  }).select({ _id: 1 });
};

const updateContact = async (userId, contactId, body) => {
  return Contact.findByIdAndUpdate({ owner: userId, _id: contactId }, body, {
    new: true,
  });
};

const updateStatusContact = async (userId, contactId, body) => {
  return Contact.findByIdAndUpdate({ owner: userId, _id: contactId }, body, {
    new: true,
  });
};

const addUser = async (user) => {
  return Users.create(user);
};

const updateAvatarUrl = async (userId, avatarUrl) => {
  return Users.findByIdAndUpdate({ _id: userId }, { avatarUrl }, { new: true });
};

const deleteTempAvatarFile = (filename) => {
  const filePath = path.join(process.cwd(), "temp", filename);
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error(`An error occured during deleting file: ${error}`);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
  addUser,
  updateAvatarUrl,
  deleteTempAvatarFile,
};

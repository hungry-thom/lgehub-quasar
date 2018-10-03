const users = require('./users/users.service.js');
const messages = require('./messages/messages.service.js');
const inventory = require('./inventory/inventory.service.js');
const audit = require('./audit/audit.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(messages);
  app.configure(inventory);
  app.configure(audit);
};

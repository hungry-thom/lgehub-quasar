// Initializes the `audit` service on path `/audit`
const createService = require('feathers-rethinkdb');
const createModel = require('../../models/inventory.model'); // using inventory model
const hooks = require('./audit.hooks');

module.exports = function (app) {
  // const Model = app.get('rethinkdbClient');
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'audit',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/audit', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('audit');

  service.hooks(hooks);
};

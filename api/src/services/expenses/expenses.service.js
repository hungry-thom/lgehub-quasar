// Initializes the `expenses` service on path `/expenses`
const createService = require('feathers-rethinkdb');
const createModel = require('../../models/inventory.model'); // using inventory model
const hooks = require('./expenses.hooks');

module.exports = function (app) {
  // const Model = app.get('rethinkdbClient');
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'expenses',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/expenses', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('expenses');

  service.hooks(hooks);
};

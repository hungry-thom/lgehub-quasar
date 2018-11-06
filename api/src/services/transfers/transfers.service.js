// Initializes the `transfers` service on path `/transfers`
const createService = require('feathers-rethinkdb');
const createModel = require('../../models/inventory.model'); // using inventory model
const hooks = require('./transfers.hooks');

module.exports = function (app) {
  // const Model = app.get('rethinkdbClient');
  const Model = createModel(app);
  const paginate = app.get('paginate');
  paginate.max=200;

  const options = {
    name: 'transfers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/transfers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('transfers');

  service.hooks(hooks);
};

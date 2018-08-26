// Initializes the `inventory` service on path `/inventory`
const createService = require('feathers-rethinkdb');
const hooks = require('./inventory.hooks');

module.exports = function (app) {
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'inventory',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/inventory', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('inventory');

  service.hooks(hooks);
};

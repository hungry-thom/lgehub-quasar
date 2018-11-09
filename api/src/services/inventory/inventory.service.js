// Initializes the `inventory` service on path `/inventory`
const createService = require('feathers-rethinkdb');
const createModel = require('../../models/inventory.model');
const hooks = require('./inventory.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');
  paginate.max=500;
  paginate.default=500;

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

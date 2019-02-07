// Initializes the `payable` service on path `/payable`
const createService = require('feathers-rethinkdb');
const createModel = require('../../models/inventory.model');
const hooks = require('./payable.hooks');

module.exports = function (app) {
  // const Model = app.get('rethinkdbClient');
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'payable',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/payable', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('payable');

  service.hooks(hooks);
};

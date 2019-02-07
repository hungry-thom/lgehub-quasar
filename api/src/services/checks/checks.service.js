// Initializes the `checks` service on path `/checks`
const createService = require('feathers-rethinkdb');
const createModel = require('../../models/inventory.model');
const hooks = require('./checks.hooks');

module.exports = function (app) {
  // const Model = app.get('rethinkdbClient');
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'checks',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/checks', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('checks');

  service.hooks(hooks);
};

// Initializes the `atlantic` service on path `/atlantic`
const createService = require('feathers-rethinkdb');
const hooks = require('./atlantic.hooks');

module.exports = function (app) {
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'atlantic',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/atlantic', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('atlantic');

  service.hooks(hooks);
};

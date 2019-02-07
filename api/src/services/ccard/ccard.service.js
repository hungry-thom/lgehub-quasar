// Initializes the `ccard` service on path `/ccard`
const createService = require('feathers-rethinkdb');
const createModel = require('../../models/inventory.model');
const hooks = require('./ccard.hooks');

module.exports = function (app) {
  // const Model = app.get('rethinkdbClient');
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'ccard',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/ccard', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('ccard');

  service.hooks(hooks);
};

const assert = require('assert');
const app = require('../../src/app');

describe('\'pricelist\' service', () => {
  it('registered the service', () => {
    const service = app.service('pricelist');

    assert.ok(service, 'Registered the service');
  });
});

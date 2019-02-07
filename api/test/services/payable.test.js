const assert = require('assert');
const app = require('../../src/app');

describe('\'payable\' service', () => {
  it('registered the service', () => {
    const service = app.service('payable');

    assert.ok(service, 'Registered the service');
  });
});

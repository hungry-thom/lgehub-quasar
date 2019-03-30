const assert = require('assert');
const app = require('../../src/app');

describe('\'atlantic\' service', () => {
  it('registered the service', () => {
    const service = app.service('atlantic');

    assert.ok(service, 'Registered the service');
  });
});

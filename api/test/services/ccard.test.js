const assert = require('assert');
const app = require('../../src/app');

describe('\'ccard\' service', () => {
  it('registered the service', () => {
    const service = app.service('ccard');

    assert.ok(service, 'Registered the service');
  });
});

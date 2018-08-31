const r = require('rethinkdbdash')({
  db: 'test', 
  servers: [{
    host: 'ec2-52-86-240-100.compute-1.amazonaws.com',
    port:28015
  }],
  password:'lifeinthewoods'
});

module.exports = function (app) {
  const Model = r;

  return Model;
};

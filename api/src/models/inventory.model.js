const r = require('rethinkdbdash')({
  db: 'koox', 
  servers: [{
    host: 'localhost',
    port:28015
  }],
  // password:'lifeinthewoods'
});

module.exports = function (app) {
  const Model = r;

  return Model;
};

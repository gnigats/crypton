var pg = require('pg').native;
var config = require('../lib/config');
var fs = require('fs');
var realConfig = JSON.parse(fs.readFileSync('./server/config/config.' + process.env.NODE_ENV + '.json', 'utf8'));
var dbConfig = realConfig.database;

function connect(callback) {
  'use strict';

  pg.connect(config.database, function(err, client, done) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    callback(client, done);
  });
}

function dropDatabase(callback) {
  'use strict';

  console.log('Dropping database...');

  connect(function(client, done) {
    var query = {
      text: 'drop database ' + dbConfig.database,
    };

    client.query(query, function(err, result) {
      done();

      if (err) {
        console.log(err);
        return callback();
      }

      console.log('Dropped database');
      callback();
    });
  });
}

function dropUser(callback) {
  'use strict';

  console.log('Dropping user...');

  connect(function(client, done) {
    var query = {
      text: 'drop role ' + dbConfig.user,
    };

    client.query(query, function(err, result) {
      done();

      if (err) {
        console.log(err);
        return callback();
      }

      console.log('Dropped user');
      callback();
    });
  });
}

module.exports = function() {
  'use strict';

  config.database.user = 'postgres';
  config.database.database = 'postgres';

  dropDatabase(function() {
    dropUser(function() {
      console.log('Done');
      process.exit();
    });
  });
};

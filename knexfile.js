'use strict';

module.exports = {
  development: {
    client: 'pg',
<<<<<<< HEAD
    connection: process.env.DATABASE_URL || 'postgres://localhost/noteful-app',
=======
    connection: process.env.DATABASE_URL || 'postgres://postgres:password@localhost/noteful-app',
>>>>>>> solution/3-folders
    debug: true, // http://knexjs.org/#Installation-debug
    pool: { min: 1, max: 2 }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};

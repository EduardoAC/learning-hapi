'use strict';

require("babel-register");
require('./server.js'); 

const Bcrypt = require('bcryptjs');
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Good = require('good');
const Basic = require('hapi-auth-basic');
const Routes = require('./lib/routes');

const server = new Hapi.Server();
server.connection({ 
    host: 'localhost',
    port: 3000 
});

const users = {
    john: {
        username: 'john',
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
        name: 'John Doe',
        id: '2133d32a'
    }
};

const validate = function (request, username, password, callback) {
    const user = users[username];
    if (!user) {
        return callback(null, false);
    }

    Bcrypt.compare(password, user.password, (err, isValid) => {
        callback(err, isValid, { id: user.id, name: user.name });
    });
};

server.register([
    Inert,
    Vision,
    {
        register: Good,
        options: {
            reporters: [{
                reporter: require('good-console'),
                events: {
                    response: '*',
                    log: '*'
                }
            }]
        }
    },
    Basic
    ], (err) => {
        server.auth.strategy('simple', 'basic', { validateFunc: validate });
        server.route(Routes);
        server.start(() => {
             console.log('Server running at:', server.info.uri);
        });
});

server.views({
    relativeTo: __dirname,
    path: 'templates',
    partialsPath: 'templates/withPartials',
    helpersPath: 'templates/helpers',
    engines: { html: require('handlebars') }
});

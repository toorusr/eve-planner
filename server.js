#!/usr/bin/node

'use strict';

const WebServer = require('./modules/webserver');

// global.debug = true

new WebServer(global.debug ? './dev' : './dist').listen(8080);

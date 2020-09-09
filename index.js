
/*const express = require('express')
var keycloak1 = require('keycloak-connect');
var session = require('express-session');
var memoryStore = new session.MemoryStore();

const app = express();

var checkSsoHandler;

var kcConfig = {
    "realm": "myrealm",
    "auth-server-url": "http://localhost:8080/auth/",
    "ssl-required": "external",
    "resource": "test",
    "public-client": true,
    "confidential-port": 0
  }

var keycloakInstance = new keycloak1({ store: memoryStore }, kcConfig);
app.use( keycloakInstance.middleware() );

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})

app.get( '/check-sso', keycloakInstance.checkSso(), (checkSsoHandler)=>{
    console.log(checkSsoHandler);
});
app.get( '/complain', keycloakInstance.protect(), (complaintHandler) => {
    console.log(checkSsoHandler);
} );

app.listen(3000, () => console.log('Example app listening on port 3000!'))*/


/*
// Create a session-store to be used by both the express-session
// middleware and the keycloak middleware.

const express = require('express')
var Keycloak = require('keycloak-connect');
var session = require('express-session');
var memoryStore = new session.MemoryStore();

const app = express();

app.use(session({
  secret: '25e86f29-d47c-44dd-9281-6bdb6cb47fbb',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Provide the session store to the Keycloak so that sessions
// can be invalidated from the Keycloak console callback.
//
// Additional configuration is read from keycloak.json file
// installed from the Keycloak web console.

var keycloak = new Keycloak({
  store: memoryStore
});

app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/admin'
}));

app.get( '/check-sso', keycloak.checkSso(), (checkSsoHandler)=>{
    console.log(checkSsoHandler);
});
app.get( '/complain', keycloak.protect(), (complaintHandler) => {
    console.log(checkSsoHandler);
} );

app.listen(3000, () => console.log('Example app listening on port 3000!'))

*/

/*
 * JBoss, Home of Professional Open Source
 * Copyright 2016, Red Hat, Inc. and/or its affiliates, and individual
 * contributors by the @authors tag. See the copyright.txt in the
 * distribution for a full listing of individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var Keycloak = require('keycloak-connect');
var cors = require('cors');

var app = express();
app.use(bodyParser.json());

// Enable CORS support
app.use(cors());

// Create a session-store to be used by both the express-session
// middleware and the keycloak middleware.

var memoryStore = new session.MemoryStore();

app.use(session({
  secret: '25e86f29-d47c-44dd-9281-6bdb6cb47fbb',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Provide the session store to the Keycloak so that sessions
// can be invalidated from the Keycloak console callback.
//
// Additional configuration is read from keycloak.json file
// installed from the Keycloak web console.

var keycloak = new Keycloak({
  store: memoryStore
});

app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/'
}));

app.get('/service/public', function (req, res) {
  res.json({message: 'public'});
});

app.get( '/service/protect', keycloak.protect(), function (req, res) {
    res.json({message: 'protect'});
});

app.get('/service/secured', keycloak.protect('realm:user'), function (req, res) {
  res.json({message: 'secured'});
});

app.get('/service/admin', keycloak.protect('realm:admin'), function (req, res) {
  res.json({message: 'admin'});
});

app.use('*', function (req, res) {
  res.send('Not found!');
});

app.listen(3000, function () {
  console.log('Started at port 3000');
});
const express = require('express');
const bodyParser = require('body-parser');
const Bluebird = require('bluebird');
const camelCaseKeys = require('camelcase-keys');

const AuthenticationError = require('../errors/authentication-error');
const NotFoundError = require('../errors/not-found-error');
const CredentialsMismatchError = require('../errors/credential-mismatch-error');
const validatePassword = require('./validate-password');

const loadUserCredential = require('./load-user-credential');
const ensureUserCredentialFound = require('./ensure-user-credential-found');
const writeLoggedInEvent = require('./write-logged-in-event');

const handleCredentialNotFound = require('./handle-credential-not-found');
const handleCredentialsMismatch = require('./handle-credential-mismatch')


function createActions({messageStore, queries}) {
  function authenticate(traceid, email, password){
    const context = {
      traceId,
      email,
      messageStore,
      password,
      queries,
    };

    return Bluebird.resolve(context)
      .then(loadUserCredential)
      .then(ensureUserCredentialFound)
      .then(validatePassword)
      .then(writeLoggedInEvent)
      .catch(NotFoundError, () => handleCredentialNotFound(context))
      .catch(CredentialMismatchError, () => handleCredentialMismatch(context))
  }
}

function createQueries({db}){
  function byEmail(email){
    return db
      .then(client =>
        client('user_credentials')
          .where({email})
          .limit(1)
      )
      .then(camelCaseKeys)
      .then(rows => rows[0])
  }

  return {byEmail}
}

function createHandlers({actions}) {
  function handleShowLoginForm(req, res) {
    req.render('authenticate/templates/login-form')
  }

  function handleLogOut(req, res){
    req.session = null;
    res.redirect('/');
  }

  function handleAuthenticate(req, res, next){
    const {
      body: {email, password},
      context: {traceId},
    } = req;

    return actions
      .authenticate(traceId, email, password)
      .then(context => {
        req.session.userId = context.userCredential.id;
        res.redirect('/');
      })
      .catch(AuthenticationError, () =>
        res.status(401)
          .render('authenticate/templates/login-form', {errors: true})
      )
      .catch(next)
  }

  return { handleAuthenticate, handleLogOut, handleShowLoginForm }
}

function build({db, messageStore}){
  const queries = createQueries({db});
  const actions = createActions({messageStore, queries});
  const handlers = createHandlers({actions});

  const router = express.Router();

  router
    .route('/log-in')
    .get(handlers.handleShowLoginForm)
    .post(
      bodyParser.urlencoded({extended: false}),
      handlers.handleAuthenticate
    );

  router
    .route('/log-out')
    .get(handlers.handleLogOut);

  //console.log('Authenticate app started');

  return {actions, handlers, queries, router}
}

module.exports = build;
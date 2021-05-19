const BlueBird = require('bluebird');
const {isObject} = require('../../utils');
const {isEmptyObject, objHasProps} = require('../../utils');
const InvalidDatabaseParameterError = Error('registerUser build(): Invalid database parameter')
const InvalidMesageStoreParameterError = Error('registerUser build(): Invalid messageStore parameter')
const ensureThereWasNoExistingEntity = require('./ensure-there-was-no-existing-identity')
const hashPassword = require('./hash-password');
const writeRegisterCommand = require('./write-register-command');
const shallowValidate = require('./shallow-validate');
const loadExistingIdentity = require('./load-existing-identity');
const ensureThereWasNoExistingIdentity = require('./ensure-there-was-no-existing-identity')
// const writeRegisterCommand = require('./write-register-command');
const Bluebird = require('bluebird');
const bodyParser = require('body-parser');
const express = require('express');

function createActions({messageStore, queries}) {
  /**
   *
   * @param {string} traceId the trace id associated with this action
   * @param {object} attributes The user supplied attributes
   * @param {string} attributes.email The email that the user is registered with
   * @param {string} attributes.password
   * @returns {an object, result of db.query()}
   */
  async function registerUser(traceId, attributes){
    if (!traceId){
      throw new TypeError('registerUser(): traceId - invalid argument')
    }

    if(!attributes){
      throw new TypeError('registerUser(): attributes - invalid argument')
    }

    if (typeof traceId !== 'string'
      || !isObject(attributes)
      || isObject(attributes) && isEmptyObject(attributes)
    ) {
      throw new TypeError('registerUser() requires two arguments: a string and an object')
    }

    if (!objHasProps(attributes, ['email','password'])){
      throw new TypeError('registerUser(): invalid attributes object')
    }

    const context = { attributes, traceId, messageStore, queries };

    return Bluebird.resolve(context)
      .then(shallowValidate)
      .then(loadExistingIdentity)
      .then(ensureThereWasNoExistingIdentity)
      .then(hashPassword)
      .then(context => writeRegisterCommand(context))
      // .catch((e) => e)
  }

  return {
    registerUser
  }
}

function createHandlers({actions}){
  function handleRegistrationForm(req, res){
    const userId = uuid();
    res.render('register-users/templates/register', {userId});
  }

  function handleRegistrationComplete(req, res){
    res.render('register-users/templates/registration-complete');
  }

  function handleRegisterUser(req, res, next){
    const attributes = {
      id: req.body.id,
      email: req.body.email,
      password: req.body.password,
    };

    return actions
      .registerUser(req.context.traceId, attributes)
      .then(() => res.redirect(301, 'register/registration-complete'))
      .catch(ValidationError, err =>
        res
          .status(400)
          .render(
            'register-users/templates/register',
            {userId: attributes.id, errors: err.errors}
          )
      )
  }

  return {
    handleRegistrationForm,
    handleRegistrationComplete,
    handleRegisterUser,
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
      .then(camelcaseKeys)
      .then(rows => rows[0])
  }

  return {byEmail}
}

function build({db, messageStore}){
  if (!db || !messageStore){
    throw new Error()
  }

  if (!isObject(db)){
    throw new Error('registerUsers build(): db should be an object')
  }

  if (!isObject(messageStore)){
    throw new Error('registerUsers build(): messageStore should be an object');
  }

  if (isEmptyObject(db)){
    throw new Error('registerUser build(): empty db object parameter')
  }

  if (isEmptyObject(messageStore)){
    throw new Error('registerUser build(): empty messageStore object parameter')
  }
  const queries = createQueries({db});
  const actions = createActions({messageStore, queries});
  const handlers = createHandlers({actions});

  const router = express.Router();

  router
    .route('/')
    .get(handlers.handleRegistrationForm)
    .post(
      bodyParser.urlencoded({extended: false}),
      handlers.handleRegisterUser
    );

  router
    .route('/registration-complete')
    .get(handlers.handleRegistrationComplete);

  //console.log('Register Users app started');

  return {
    actions, handlers, queries, router,
  }
}

module.exports = build;
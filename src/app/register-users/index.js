const {isObject} = require('../../utils');
const {isEmptyObject, objHasProps} = require('../../utils');
const InvalidDatabaseParameterError = Error('registerUser build(): Invalid database parameter')
const InvalidMesageStoreParameterError = Error('registerUser build(): Invalid messageStore parameter')

// const writeRegisterCommand = require('./write-register-command');

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



  function createActions() {
    /**
     *
     * @param {string} traceId the trace id associated with this action
     * @param {object} attributes The user supplied attributes
        * @param {string} attributes.email The email that the user is registered with
        * @param {string} attributes.password
     * @returns {an object, result of db.query()}
     */
    async function registerUser(traceId, attributes){
      console.log('PPPPPPPPPPPPPPP traceid=', traceId, ' and attributes=', attributes)
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

      try{
        objHasProps(attributes, ['email','password'])
      }
        catch{e => {
          throw new TypeError('registerUser(): invalid attributes object')
        }
      }

      return db.query();
    }
    return {
      registerUser
    }
  }


  const actions = createActions();
  const handlers = {};
  const queries = {};
  const routers = {};

  return {
    actions, handlers, queries, routers,
  }
}

module.exports = build;
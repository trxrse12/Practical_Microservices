function isObject(variable){
  return Object.prototype.toString.call(variable) === '[object Object]'
}

function isEmptyObject(variable){
  if (!isObject(variable)){
    return false;
  }
  return (Object.keys(variable).length===0)
}

function objHasProps(anObject, propsList){
  let missingProp;
  if (!isObject(anObject)
    || !Array.isArray(propsList)
    || isEmptyObject(anObject)){
    throw new TypeError(`objHasProps(): needs an object argument: + ${anObject}`)
  }
  if (propsList.length===0){
    throw new TypeError('objHasProps(): needs a non-empty array of props')
  }

  let p;
  let rightPropsCount = 0;
  for (p in anObject){
    if (propsList.indexOf(p)>=0){
      rightPropsCount++;
    } else {
      missingProp = p;
    }
  }

  if (rightPropsCount===propsList.length){
    return true
  }
  return false
}

function httpContextIsValid({ context, propList }) {
  if (!isObject(context)) {
    return false;
  }
  if (!Array.isArray(propList) || propList.length === 0 || !propList[0]) {
    return false;
  }
  if(!objHasProps(context,propList))
  {
    return false;
  }
  return true;
}

const flipConfig = fn => {
  if (typeof fn !== 'function'){
    throw('flipConfig error: argument should be a function')
  }
  if (fn.length===0){
    throw('flipConfig error: argument function should have at least a parameter')
  }
  return (config, ...args) => {
    return fn(...args, config);
  }
};


module.exports = {
  isObject,
  isEmptyObject,
  objHasProps,
  httpContextIsValid,
  flipConfig,
};
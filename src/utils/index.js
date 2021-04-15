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
  if (!isObject(anObject)
    || !Array.isArray(propsList)
    || isEmptyObject(anObject)){
    throw new TypeError(`objHasProps(): needs an object argument: + ${anObject}`)
  }
  if (propsList.length===0){
    throw new TypeError('objHasProps(): needs a non-empty array of props')
  }

  let p, rightPropsCount=0;
  for (p in anObject){
    if (propsList.indexOf(p)>=0){
      rightPropsCount++;
    }
  }

  if (rightPropsCount===propsList.length){
    return true
  }

  return false
}

function httpContextIsValid({context}){
  if(!isObject(context) || !objHasProps(context, [
    'attributes', 'traceId', 'passwordHash', 'messageStore']))
  {
    return false
  }
  return true
}

module.exports = {
  isObject,
  isEmptyObject,
  objHasProps,
  httpContextIsValid
};
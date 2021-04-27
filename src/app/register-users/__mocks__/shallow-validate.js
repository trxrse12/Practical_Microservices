function shallowValidate(context) {
  return new Promise((resolve, reject) => {
    context.chiomb = 'AAAA'
    context
      ? process.nextTick(() => resolve(context))
      : process.nextTick((() => reject('Error in shallow validation')))
  })
}

module.exports = shallowValidate;
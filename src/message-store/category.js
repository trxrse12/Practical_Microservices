function category (streamName){
  // double equal to catch null and undefined
  if (stream == null){
    return ''
  }

  return streamName.split('-')[0]
}

module.exports = category;
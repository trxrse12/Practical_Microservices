const fakeDb = {
  query: async (...[streamName, fromPosition, maxMessages]) =>{
    const resObject = {};
    resObject.rows = [];
    resObject.rows = await Promise.resolve([{a:1},{b:2}]);
    return resObject;
  },

};

module.exports = fakeDb;
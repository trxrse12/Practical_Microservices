const {app, config} = require('./');

Promise.each = async function(arr, fn) { // take an array and a function
  for(const item of arr) await fn(item);
}

async function reset () {
  const tablesToWipe = [
    'pages',
    'user_credentials',
    'creators_portal_videos',
    // 'video_operations',
    // 'admin_subscriber_positions',
    // 'admin_streams',
    // 'admin_users'
  ]

  return Promise.each(tablesToWipe, async table =>
    await config.db.then(client => {
      return client(table).del()
    })
  );
}

module.exports.config = config;
module.exports.reset = reset;
module.exports.app = app;
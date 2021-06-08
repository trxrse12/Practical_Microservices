const request = require('supertest');
const createExpressApp = require('./index');

const config = {};
const env = {};

describe('app', () => {
  function app(){
    return createExpressApp({ config, env });
  }

  it('serves a Not Found error page', async () => {
    await request(app()).get('/').expect(404);
  })
});
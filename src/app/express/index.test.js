import createExpressApp from './index';
import request from 'supertest';

const config = {};
const env = {};

describe('app', () => {
  function app(){
    return createExpressApp({config, env});
  }

  it('serves a Not Found error page', async () => {
    await request(app()).get('/').expect(404);
  })
});
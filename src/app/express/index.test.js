import createExpressApp from './index';
import request from 'supertest';

const config = {};
const env = {};

describe.skip('app', () => {
  function app(){
    return createExpressApp({config, env});
  }

  it('serves an index page', async () => {
    await request(app()).get('/').expect(200);
  })
});
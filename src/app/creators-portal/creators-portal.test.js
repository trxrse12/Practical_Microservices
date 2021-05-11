jest.disableAutomock();
const createExpressApp = require('../express/index');
const supertest = require('supertest');
const {app, config, reset} = require('../../test-helpers');

// console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAA app=',app);

let addSpy;

describe('app', () => {
  it('can publish a video', async () => {
    const videoToPublish = {
      id: 100
    }

    // console.log('BBBBBBBBBBBBBBBBBBBB app=', app)
    return reset()
      .then(() =>
        supertest(app)
          .post('/publish-video')
          .send(videoToPublish)
          .expect(201)
         )
  });
});

// describe('POST /publish-video', () => {
//   it('passes the publish-video to the right handler', () => {
//     expect(1).toBe(1)
//   });
// });
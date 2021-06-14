const Bluebird =require('bluebird');
const createExpressApp = require('../express/index');
const supertest = require('supertest');
const {app, config, reset} = require('../../integration-test-helpers');
const bcrypt = require('bcrypt');
const snakeCaseKeys = require('snakecase-keys');
const {v4:uuidv4} = require('uuid');

function getMountedRoutes(app){
  app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
      console.log('ROUTE: ' + r.route.path);
      console.log('METHOD: ' + r.route.methods);
    }
  })
}

describe('app', () => {
  afterAll(() => {
    config.db
      .then(client => client.destroy())

    config.messageStore.stop();
  });
  it('notifying server of an upload triggers PublishVideo command', async () => {
    const videoId = uuidv4();
    const creatorId = uuidv4();
    const creator = {
      id: creatorId,
      email: 'creator@example.com',
      passwordHash: 'notahash'
    }

    let resolveRequestPromise = null;
    const waitForRequestToFinish = new Bluebird(resolve => {
      resolveRequestPromise = resolve;
    })


    const req = {
      body: {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoId
      },
      context: {
        traceId: uuidv4(),
        userId: creator.id,
        videoId,
      }
    }

    const res = {
      json: resolveRequestPromise
    }

    const commandStreamName = `videoPublishing:command-${req.body.videoId}`;

    return reset()
      .then(() =>
        config.db.then(client =>
          client('user_credentials').insert(
            snakeCaseKeys(creator)
          )
        )
      )
      .then(() => config.creatorsPortalApp.handlers.handlePublishVideo(req, res))
      .then(() => waitForRequestToFinish) // wait 2 seconds
      .then(() =>
        // Having received the notification, we expect there to be an event for this in the videos stream
        config.messageStore.read(commandStreamName)
          .then(messages => {
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('PublishVideo');
            expect(messages[0].data.videoId).toBe(req.body.videoId);
          })
      )
  });
});
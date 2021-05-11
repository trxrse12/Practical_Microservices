const express = require('express');
const bodyParser = require('body-parser');
const {v4:uuidv4} = require('uuid');

function createActions ({messageStore, queries}){
  function publishVideo(context, videoId, sourceUri){
    const publishVideoCommand = {
      id: uuidv4(),
      type: 'PublishVideo',
      metadata: {
        traceId: context.traceId,
        userId: context.userId,
      },
      data: {
        ownerId: context.userId,
        sourceUri: sourceUri, // comes from the req object
        videoId: videoId, // comes from the req object
      }
    };

    const streamName = `videoPublishing:command-${videoId}`;

    return messageStore.write(streamName, publishVideoCommand);
  }

  return {
    publishVideo,
  }
}

function createHandlers ({actions, queries}){
  function handlePublishVideo(req, res, next) {
    return actions
      .publishVideo(req.context, req.body.videoId, req.body.url)
      .then(() => res.json('"ok"'))
      .catch(next);
  }

  function handleShowVideo(req, res, next){
    const videoId = req.params.id;
    const ownerId = req.context.userId;

    return queries
      .videoByIdAndOwnerId(videoId, ownerId)
      .then(video => {
        const template = video
          ? 'creators-portal/templates/video'
          : 'common-templates/404'
      })
  }

  return {
    handlePublishVideo,
  }
}

function createQueries({db}){
  return {};
}

function createCreatorsPortal({db, messageStore}){
  const queries = createQueries({db});
  const actions = createActions({messageStore, queries});
  const handlers = createHandlers({actions, queries});

  const router = express.Router();
  router
    .route('/publish-video')
    .post(bodyParser.json(),handlers.handlePublishVideo);
  // router.route('/videos/:id').get(handlers.handleShowVideo);
  // router.route('/').get(handlers.handleDashboard);

  //console.log('Creators-portal app started');

  return {handlers,router};
}

module.exports = createCreatorsPortal;